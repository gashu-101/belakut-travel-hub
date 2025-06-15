
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/providers/AuthProvider"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addHotel } from "@/lib/api"
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
  image: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  amenities: z.string().optional(),
})

const AddHotelForm = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      type: "Hotel",
      price_range: "$$",
      image: "",
      amenities: "",
    },
  })

  const addHotelMutation = useMutation({
    mutationFn: addHotel,
    onSuccess: (data) => {
      toast({
        title: "Property Added!",
        description: "Your new property has been successfully listed.",
      })
      queryClient.invalidateQueries({ queryKey: ['hotels'] });
      if (data) {
        navigate(`/hotels/${data.id}`);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `There was a problem adding your property: ${error.message}`,
        variant: "destructive",
      })
      console.error("Mutation error:", error);
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to add a property.",
        variant: "destructive",
      })
      return
    }

    const hotelData: InsertHotel = {
        name: values.name,
        description: values.description,
        location: values.location,
        type: values.type,
        price_range: values.price_range,
        image: values.image || null,
        amenities: values.amenities ? values.amenities.split(',').map(s => s.trim()).filter(Boolean) : null,
        owner_id: user.id,
    };

    addHotelMutation.mutate(hotelData);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Name</FormLabel>
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
                <Textarea placeholder="Tell us about your property" {...field} />
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
                <Input placeholder="e.g. New York, USA" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                            </Trigger>
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

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Main Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="amenities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amenities</FormLabel>
              <FormControl>
                <Input placeholder="Wi-Fi, Pool, Spa" {...field} />
              </FormControl>
              <FormDescription>
                Enter a comma-separated list of amenities.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={addHotelMutation.isPending}>
          {addHotelMutation.isPending ? 'Saving...' : 'Save Property'}
        </Button>
      </form>
    </Form>
  )
}

export default AddHotelForm
