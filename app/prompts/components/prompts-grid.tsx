"use client";

import { createPrompt, deletePrompt, updatePrompt } from "@/actions/prompts-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SelectPrompt } from "@/db/schema/prompts-schema";
import { motion } from "framer-motion";
import { Check, Copy, Edit2, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface PromptsGridProps {
  initialPrompts: SelectPrompt[];
}

export const PromptsGrid = ({ initialPrompts }: PromptsGridProps) => {
  // State for prompts and UI
  const [prompts, setPrompts] = useState<SelectPrompt[]>(initialPrompts);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Loading states
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    content: ""
  });

  // Function to copy prompt content to clipboard
  const copyToClipboard = async (prompt: SelectPrompt) => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopiedId(prompt.id);
      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  // Function to handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Function to start editing a prompt
  const startEditing = (prompt: SelectPrompt) => {
    setFormData({
      name: prompt.name,
      description: prompt.description,
      content: prompt.content
    });
    setEditingId(prompt.id);
    setError(null);
  };

  // Function to cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setFormData({ name: "", description: "", content: "" });
    setError(null);
  };

  // Function to handle form submission (create or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      if (editingId) {
        // Update existing prompt
        const updatedPrompt = await updatePrompt({ id: editingId, ...formData });
        setPrompts((prev) => prev.map((p) => (p.id === editingId ? updatedPrompt : p)));
        setEditingId(null);
      } else {
        // Create new prompt
        const newPrompt = await createPrompt(formData);
        setPrompts((prev) => [newPrompt, ...prev]);
        setIsCreating(false);
      }
      setFormData({ name: "", description: "", content: "" });
    } catch (err) {
      console.error("Failed to save prompt:", err);
      setError("Failed to save prompt. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Function to handle prompt deletion
  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    try {
      await deletePrompt(id);
      setPrompts((prev) => prev.filter((p) => p.id !== id));
      setDeletingId(null);
    } catch (err) {
      console.error("Failed to delete prompt:", err);
      setError("Failed to delete prompt. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Create prompt button */}
      <div className="mb-6 flex justify-end">
        <Button
          onClick={() => setIsCreating(true)}
          className="gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Prompt
        </Button>
      </div>

      {/* Create/Edit form */}
      {(isCreating || editingId) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Edit Prompt" : "Create Prompt"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter prompt name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter prompt description"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="Enter prompt content"
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={editingId ? cancelEditing : () => setIsCreating(false)}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {editingId ? "Saving..." : "Creating..."}
                      </>
                    ) : editingId ? (
                      "Save Changes"
                    ) : (
                      "Create"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {prompts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300">No prompts found. Add some prompts to get started!</p>
        </div>
      ) : (
        <>
          {/* Delete confirmation dialog */}
          <Dialog
            open={!!deletingId}
            onOpenChange={(open) => !open && setDeletingId(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Prompt</DialogTitle>
                <DialogDescription>Are you sure you want to delete this prompt? This action cannot be undone.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeletingId(null)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deletingId && handleDelete(deletingId)}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Prompts grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt, index) => (
              <motion.div
                key={prompt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{prompt.name}</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{prompt.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEditing(prompt)}
                          title="Edit prompt"
                        >
                          <Edit2 className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingId(prompt.id)}
                          title="Delete prompt"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(prompt)}
                          title="Copy prompt"
                        >
                          {copiedId === prompt.id ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700/50 rounded p-3">{prompt.content}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </>
  );
};
