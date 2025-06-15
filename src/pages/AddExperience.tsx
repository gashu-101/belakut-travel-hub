
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { addExperience, uploadExperienceImage } from "@/lib/experienceApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AddExperience = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  const createExperienceMutation = useMutation({
    mutationFn: addExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      queryClient.invalidateQueries({ queryKey: ['user-experiences'] });
      toast.success("Experience created successfully!");
      navigate("/experiences");
    },
    onError: (error) => {
      toast.error(`Failed to create experience: ${error.message}`);
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadExperienceImage(imageFile);
      }
      
      const experienceData = {
        name: formData.get("name") as string,
        location: formData.get("location") as string,
        category: formData.get("category") as string || null,
        duration: formData.get("duration") as string || null,
        price_per_guest: formData.get("price") ? Number(formData.get("price")) : null,
        provider: formData.get("provider") as string || null,
        description: formData.get("description") as string || null,
        image: imageUrl,
      };

      createExperienceMutation.mutate(experienceData);
    } catch (error) {
      toast.error("Failed to create experience");
      console.error("Error creating experience:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Add New Experience</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Experience Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Experience Name *</Label>
                <Input id="name" name="name" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input id="location" name="location" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category">
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cultural">Cultural</SelectItem>
                      <SelectItem value="adventure">Adventure</SelectItem>
                      <SelectItem value="food">Food & Drink</SelectItem>
                      <SelectItem value="nature">Nature</SelectItem>
                      <SelectItem value="historical">Historical</SelectItem>
                      <SelectItem value="wellness">Wellness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input id="duration" name="duration" placeholder="e.g., 2 hours, Half day" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price per Guest</Label>
                  <Input id="price" name="price" type="number" step="0.01" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provider">Provider/Host</Label>
                  <Input id="provider" name="provider" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  rows={4}
                  placeholder="Describe your experience..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Cover Image</Label>
                <Input 
                  id="image" 
                  name="image" 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Experience"}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/experiences")}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddExperience;
