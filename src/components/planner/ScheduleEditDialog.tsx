
import React, { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { ClipboardEdit, Clock, Save, Trash } from "lucide-react";

type ScheduleItem = {
  id: string;
  time: string;
  activity: string;
  duration: number;
  notes: string;
  column: "morning" | "afternoon" | "evening" | "midnight";
};

type ScheduleEditDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTime: string;
  selectedColumn: "morning" | "afternoon" | "evening" | "midnight" | null;
  onSave: (item: Omit<ScheduleItem, "id">) => void;
  existingItem?: ScheduleItem;
  onDelete?: () => void;
};

const ScheduleEditDialog = ({
  open,
  onOpenChange,
  selectedTime,
  selectedColumn,
  onSave,
  existingItem,
  onDelete,
}: ScheduleEditDialogProps) => {
  const [activity, setActivity] = useState(existingItem?.activity || "");
  const [duration, setDuration] = useState(existingItem?.duration || 15);
  const [notes, setNotes] = useState(existingItem?.notes || "");

  // Reset form when dialog opens with new data
  React.useEffect(() => {
    if (open) {
      setActivity(existingItem?.activity || "");
      setDuration(existingItem?.duration || 15);
      setNotes(existingItem?.notes || "");
    }
  }, [open, existingItem]);

  const handleSave = () => {
    if (!activity.trim()) {
      toast({
        title: "Aktivitas diperlukan",
        description: "Silakan masukkan nama aktivitas",
        variant: "destructive",
      });
      return;
    }

    if (!selectedColumn) {
      toast({
        title: "Error",
        description: "Kolom tidak valid",
        variant: "destructive",
      });
      return;
    }

    onSave({
      time: selectedTime,
      activity,
      duration,
      notes,
      column: selectedColumn,
    });

    onOpenChange(false);
    toast({
      title: "Berhasil",
      description: "Jadwal berhasil disimpan",
    });
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      onOpenChange(false);
      toast({
        title: "Terhapus",
        description: "Jadwal berhasil dihapus",
      });
    }
  };

  const isEditing = !!existingItem;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {isEditing ? "Edit Jadwal" : "Tambah Jadwal Baru"}: {selectedTime}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="activity" className="text-sm font-medium">
              Aktivitas
            </label>
            <Input
              id="activity"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              placeholder="Masukkan nama aktivitas"
              autoFocus
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="duration" className="text-sm font-medium">
              Durasi (menit)
            </label>
            <Input
              id="duration"
              type="number"
              min="15"
              step="15"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 15)}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Catatan
            </label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tambahkan detail..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <div>
            {isEditing && (
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                className="gap-1"
              >
                <Trash className="h-4 w-4" />
                Hapus
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button onClick={handleSave} className="gap-1">
              <Save className="h-4 w-4" />
              Simpan
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleEditDialog;
