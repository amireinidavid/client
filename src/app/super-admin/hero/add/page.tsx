"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useHomepageStore } from "@/store/useHomepageStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ImageUpload } from "@/components/ui/image-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Suspense } from "react";

const heroSlideSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  description: z.string().min(1, "Description is required"),
  ctaText: z.string().min(1, "CTA text is required"),
  ctaLink: z.string().min(1, "CTA link is required"),
  order: z.coerce.number().min(0, "Order must be a positive number"),
});

type HeroSlideFormValues = z.infer<typeof heroSlideSchema>;

function AddHeroSlideContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slideId = searchParams.get("id");
  const { createHeroSlide, updateHeroSlide, heroSlides, fetchAdminHeroSlides } =
    useHomepageStore();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const form = useForm<HeroSlideFormValues>({
    resolver: zodResolver(heroSlideSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      ctaText: "",
      ctaLink: "",
      order: 0,
    },
  });

  useEffect(() => {
    const initializeForm = async () => {
      if (slideId && !isInitialized) {
        setIsLoading(true);
        try {
          await fetchAdminHeroSlides();
          const slide = heroSlides.find((s) => s.id === slideId);
          if (slide) {
            form.reset({
              title: slide.title,
              subtitle: slide.subtitle,
              description: slide.description,
              ctaText: slide.ctaText,
              ctaLink: slide.ctaLink,
              order: slide.order,
            });
            setPreview(slide.image);
          }
          setIsInitialized(true);
        } catch (error) {
          toast.error("Failed to fetch slide data");
        } finally {
          setIsLoading(false);
        }
      }
    };

    initializeForm();
  }, [slideId, isInitialized]);

  const onSubmit = async (data: HeroSlideFormValues) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      if (image) {
        formData.append("image", image);
      }
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });

      if (slideId) {
        await updateHeroSlide(slideId, formData);
        toast.success("Hero slide updated successfully");
      } else {
        if (!image) {
          toast.error("Please upload an image");
          return;
        }
        await createHeroSlide(formData);
        toast.success("Hero slide created successfully");
      }

      router.push("/super-admin/hero/list");
      router.refresh();
    } catch (error) {
      toast.error(
        slideId ? "Failed to update hero slide" : "Failed to create hero slide"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>
            {slideId ? "Edit Hero Slide" : "Add New Hero Slide"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter title"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtitle</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter subtitle"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter description"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                        value={field.value}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="ctaText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CTA Text</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter CTA text"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ctaLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CTA Link</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter CTA link"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter display order"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Hero Image</FormLabel>
                <ImageUpload
                  value={preview}
                  onChange={(file) => {
                    setImage(file);
                    setPreview(URL.createObjectURL(file));
                  }}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading}>
                  {slideId ? "Update Hero Slide" : "Create Hero Slide"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AddHeroSlidePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddHeroSlideContent />
    </Suspense>
  );
}
