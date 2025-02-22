"use client";

import { useEffect, useState } from "react";
import { useHomepageStore } from "@/store/useHomepageStore";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, GripVertical, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function HeroSlideListPage() {
  const {
    heroSlides,
    fetchAdminHeroSlides,
    deleteHeroSlide,
    updateHeroSlideOrder,
    toggleHeroSlideStatus,
  } = useHomepageStore();
  const [orderedSlides, setOrderedSlides] = useState(heroSlides);

  useEffect(() => {
    fetchAdminHeroSlides();
  }, [fetchAdminHeroSlides]);

  useEffect(() => {
    setOrderedSlides(heroSlides);
  }, [heroSlides]);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(orderedSlides);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setOrderedSlides(items);

    // Update the order in the backend
    const updates = items.map((slide, index) => ({
      id: slide.id,
      order: index,
    }));

    try {
      await updateHeroSlideOrder(updates);
      toast.success("Slide order updated successfully");
    } catch (error) {
      toast.error("Failed to update slide order");
      setOrderedSlides(heroSlides); // Reset to original order
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteHeroSlide(id);
      toast.success("Hero slide deleted successfully");
    } catch (error) {
      toast.error("Failed to delete hero slide");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await toggleHeroSlideStatus(id, !currentStatus);
      toast.success(
        `Hero slide ${currentStatus ? "deactivated" : "activated"} successfully`
      );
    } catch (error) {
      toast.error("Failed to update hero slide status");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Hero Slides</h1>
        <Link href="/super-admin/hero/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Slide
          </Button>
        </Link>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="hero-slides">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {orderedSlides.map((slide, index) => (
                <Draggable key={slide.id} draggableId={slide.id} index={index}>
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="mb-4"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab"
                          >
                            <GripVertical className="h-5 w-5 text-neutral-400" />
                          </div>

                          <div className="relative h-32 w-48">
                            <Image
                              src={slide.image}
                              alt={slide.title}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">{slide.title}</h3>
                              <Badge
                                variant={
                                  slide.isActive ? "default" : "secondary"
                                }
                              >
                                {slide.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <p className="text-sm text-neutral-600 mb-1">
                              {slide.subtitle}
                            </p>
                            <p className="text-xs text-neutral-500">
                              Last updated:{" "}
                              {format(new Date(slide.updatedAt), "MMM d, yyyy")}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleToggleStatus(slide.id, slide.isActive)
                              }
                            >
                              {slide.isActive ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Link
                              href={`/super-admin/hero/add?id=${slide.id}`}
                              className="inline-flex"
                            >
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete Hero Slide
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this hero
                                    slide? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(slide.id)}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
