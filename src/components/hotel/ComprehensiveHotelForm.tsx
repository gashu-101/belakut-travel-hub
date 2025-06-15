
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Upload, Plus } from "lucide-react"
import { useAuth } from "@/providers/AuthProvider"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addHotel, addHotelRoom, addHotelHall, addHotelService, addHotelImage, uploadHotelImage } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import { useNavigate } from "react-router-dom"
import { Constants } from "@/integrations/supabase/types"
import { InsertHotel } from "@/types"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  location: z.string().min(2, "Location must be at least 2 characters."),
  type: z.enum(Constants.public.Enums.hotel_type),
  price_range: z.enum(Constants.public.Enums.price_range),
})

const ComprehensiveHotelForm = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const [images, setImages] = useState<File[]>([])
  const [rooms, setRooms] = useState<any[]>([])
  const [halls, setHalls] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      type: "Hotel",
      price_range: "$$",
    },
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files)
      setImages(prev => [...prev, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const addRoom = () => {
    setRooms(prev => [...prev, {
      room_type: 'Standard Rooms',
      total_numbers: 0,
      features: [],
      price: 0,
      additional_services: []
    }])
  }

  const updateRoom = (index: number, field: string, value: any) => {
    setRooms(prev => prev.map((room, i) => 
      i === index ? { ...room, [field]: value } : room
    ))
  }

  const removeRoom = (index: number) => {
    setRooms(prev => prev.filter((_, i) => i !== index))
  }

  const addHall = () => {
    setHalls(prev => [...prev, {
      hall_type: 'Meeting Rooms',
      accommodation_limit: '',
      price: 0,
      additional_services: []
    }])
  }

  const updateHall = (index: number, field: string, value: any) => {
    setHalls(prev => prev.map((hall, i) => 
      i === index ? { ...hall, [field]: value } : hall
    ))
  }

  const removeHall = (index: number) => {
    setHalls(prev => prev.filter((_, i) => i !== index))
  }

  const addService = () => {
    setServices(prev => [...prev, {
      service_category: 'Restaurants',
      service_name: '',
      description: '',
      features: [],
      price: 0
    }])
  }

  const updateService = (index: number, field: string, value: any) => {
    setServices(prev => prev.map((service, i) => 
      i === index ? { ...service, [field]: value } : service
    ))
  }

  const removeService = (index: number) => {
    setServices(prev => prev.filter((_, i) => i !== index))
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to add a property.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // 1. Create the hotel
      const hotelData: InsertHotel = {
        ...values,
        owner_id: user.id,
      }

      const hotel = await addHotel(hotelData)

      // 2. Upload images and save to database
      const imagePromises = images.map(async (file, index) => {
        const imageUrl = await uploadHotelImage(file, hotel.id)
        return addHotelImage({
          hotel_id: hotel.id,
          image_url: imageUrl,
          image_type: index === 0 ? 'main' : 'general',
          sort_order: index
        })
      })

      // 3. Add rooms
      const roomPromises = rooms.map(room => 
        addHotelRoom({
          ...room,
          hotel_id: hotel.id
        })
      )

      // 4. Add halls
      const hallPromises = halls.map(hall =>
        addHotelHall({
          ...hall,
          hotel_id: hotel.id
        })
      )

      // 5. Add services
      const servicePromises = services.map(service =>
        addHotelService({
          ...service,
          hotel_id: hotel.id
        })
      )

      await Promise.all([
        ...imagePromises,
        ...roomPromises,
        ...hallPromises,
        ...servicePromises
      ])

      toast({
        title: "Hotel Added Successfully!",
        description: "Your hotel has been created with all details.",
      })

      queryClient.invalidateQueries({ queryKey: ['hotels'] })
      navigate(`/hotels/${hotel.id}`)

    } catch (error: any) {
      toast({
        title: "Error",
        description: `There was a problem adding your hotel: ${error.message}`,
        variant: "destructive",
      })
      console.error("Error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Hotel Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hotel Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. The Grand Resort" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us about your hotel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Addis Ababa, Ethiopia" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a property type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Constants.public.Enums.hotel_type.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price_range"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Range</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a price range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Constants.public.Enums.price_range.map(pr => (
                          <SelectItem key={pr} value={pr}>{pr}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Hotel Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button type="button" variant="outline" className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Images
                  </Button>
                </label>
              </div>
              
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => removeImage(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Rooms Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Rooms
              <Button type="button" onClick={addRoom} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Room
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {rooms.map((room, index) => (
              <div key={index} className="border p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Room {index + 1}</h4>
                  <Button type="button" onClick={() => removeRoom(index)} variant="destructive" size="sm">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select value={room.room_type} onValueChange={(value) => updateRoom(index, 'room_type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Constants.public.Enums.room_type.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Total Numbers"
                    value={room.total_numbers}
                    onChange={(e) => updateRoom(index, 'total_numbers', parseInt(e.target.value) || 0)}
                  />
                  <Input
                    type="number"
                    placeholder="Price ($)"
                    value={room.price}
                    onChange={(e) => updateRoom(index, 'price', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="mt-4 space-y-2">
                  <Textarea
                    placeholder="Features (one per line)"
                    value={room.features?.join('\n') || ''}
                    onChange={(e) => updateRoom(index, 'features', e.target.value.split('\n').filter(Boolean))}
                  />
                  <Textarea
                    placeholder="Additional Services (one per line)"
                    value={room.additional_services?.join('\n') || ''}
                    onChange={(e) => updateRoom(index, 'additional_services', e.target.value.split('\n').filter(Boolean))}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Halls Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Halls
              <Button type="button" onClick={addHall} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Hall
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {halls.map((hall, index) => (
              <div key={index} className="border p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Hall {index + 1}</h4>
                  <Button type="button" onClick={() => removeHall(index)} variant="destructive" size="sm">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select value={hall.hall_type} onValueChange={(value) => updateHall(index, 'hall_type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Constants.public.Enums.hall_type.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Accommodation Limit"
                    value={hall.accommodation_limit}
                    onChange={(e) => updateHall(index, 'accommodation_limit', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Price ($)"
                    value={hall.price}
                    onChange={(e) => updateHall(index, 'price', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="mt-4">
                  <Textarea
                    placeholder="Additional Services (one per line)"
                    value={hall.additional_services?.join('\n') || ''}
                    onChange={(e) => updateHall(index, 'additional_services', e.target.value.split('\n').filter(Boolean))}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Services Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Services
              <Button type="button" onClick={addService} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {services.map((service, index) => (
              <div key={index} className="border p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Service {index + 1}</h4>
                  <Button type="button" onClick={() => removeService(index)} variant="destructive" size="sm">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select value={service.service_category} onValueChange={(value) => updateService(index, 'service_category', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Constants.public.Enums.service_category.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Service Name"
                    value={service.service_name}
                    onChange={(e) => updateService(index, 'service_name', e.target.value)}
                  />
                </div>
                <div className="mt-4 space-y-2">
                  <Textarea
                    placeholder="Description"
                    value={service.description}
                    onChange={(e) => updateService(index, 'description', e.target.value)}
                  />
                  <Textarea
                    placeholder="Features (one per line)"
                    value={service.features?.join('\n') || ''}
                    onChange={(e) => updateService(index, 'features', e.target.value.split('\n').filter(Boolean))}
                  />
                  <Input
                    type="number"
                    placeholder="Price ($)"
                    value={service.price}
                    onChange={(e) => updateService(index, 'price', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
          {isSubmitting ? 'Creating Hotel...' : 'Create Hotel'}
        </Button>
      </form>
    </Form>
  )
}

export default ComprehensiveHotelForm
