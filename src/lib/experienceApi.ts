
import { supabase } from "@/integrations/supabase/client";
import { InsertExperience } from "@/types";

export async function uploadExperienceImage(file: File, experienceId?: string): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User must be authenticated to upload images");
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}/${experienceId || 'temp'}_${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('experience-images')
    .upload(fileName, file);

  if (error) {
    console.error("Error uploading experience image:", error);
    throw new Error(error.message);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('experience-images')
    .getPublicUrl(data.path);

  return publicUrl;
}

export async function addExperience(experienceData: Omit<InsertExperience, 'owner_id'>) {
  console.log("Attempting to add experience:", experienceData);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error("User not authenticated");
    throw new Error("User must be authenticated to add experiences");
  }
  
  console.log("User authenticated:", user.id);
  
  const { data, error } = await supabase
    .from("experiences")
    .insert({ ...experienceData, owner_id: user.id })
    .select()
    .single();

  if (error) {
    console.error("Error adding experience:", error);
    throw new Error(error.message);
  }

  console.log("Successfully added experience:", data);
  return data;
}

export async function getExperiences() {
  console.log("Fetching all experiences...");
  const { data, error } = await supabase.from("experiences").select("*");

  if (error) {
    console.error("Error fetching experiences:", error);
    throw new Error(error.message);
  }
  console.log("Fetched experiences:", data);
  return data;
}

export async function getUserExperiences() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User must be authenticated");
  }

  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user experiences:", error);
    throw new Error(error.message);
  }

  return data;
}
