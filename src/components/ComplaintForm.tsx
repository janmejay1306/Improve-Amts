import { useState, useRef } from "react";
import { Camera, X, Upload, CheckCircle, AlertTriangle, Mail, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface ComplaintFormProps {
  busId: string;
  routeNumber: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ComplaintForm({ busId, routeNumber, isOpen, onClose }: ComplaintFormProps) {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [notifySMS, setNotifySMS] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const categories = [
    "Bus Not Running on Time",
    "Poor Vehicle Condition",
    "Rude Conductor/Driver",
    "Overcrowding",
    "AC Not Working",
    "Cleanliness Issue",
    "Safety Concern",
    "Other",
  ];

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please check permissions or use file upload instead.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg");
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setCapturedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const complaintPayload = {
        busId,
        routeNumber,
        category,
        description,
        contactName: contactName || null,
        contactPhone: contactPhone || null,
        contactEmail: contactEmail || null,
        notifySMS,
        notifyEmail,
        hasImage: !!capturedImage,
        image: capturedImage // Store image as base64 - in production, you'd upload to storage
      };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d1a519b5/complaint`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(complaintPayload),
        }
      );

      const data = await response.json();

      if (data.success) {
        setComplaintId(data.complaintId);
        console.log("Complaint saved to database:", data.complaint);
        setIsSubmitting(false);
        setIsSubmitted(true);
      } else {
        throw new Error(data.error || "Failed to save complaint");
      }
    } catch (error) {
      console.error("Error saving complaint:", error);
      alert("Failed to submit complaint. Please try again.");
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCategory("");
    setDescription("");
    setContactName("");
    setContactPhone("");
    setContactEmail("");
    setNotifySMS(false);
    setNotifyEmail(false);
    setCapturedImage(null);
    setIsSubmitted(false);
    setComplaintId("");
    stopCamera();
    onClose();
  };

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={resetForm}>
        <DialogContent className="max-w-md">
          <div className="text-center py-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <DialogTitle className="mb-2">Complaint Submitted Successfully!</DialogTitle>
            <DialogDescription className="mb-4">
              Your complaint has been registered and will be reviewed by our team.
            </DialogDescription>
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600 mb-1">Your Complaint ID</p>
              <p className="text-2xl text-gray-900">{complaintId}</p>
            </div>

            {(notifySMS || notifyEmail) && (
              <div className="bg-green-50 p-4 rounded-lg mb-4 text-left">
                <p className="text-sm text-green-800 mb-2">
                  ✓ Notifications enabled
                </p>
                {notifySMS && (
                  <p className="text-xs text-green-700 flex items-center gap-2">
                    <MessageSquare className="w-3 h-3" />
                    SMS updates to {contactPhone}
                  </p>
                )}
                {notifyEmail && (
                  <p className="text-xs text-green-700 flex items-center gap-2 mt-1">
                    <Mail className="w-3 h-3" />
                    Email updates to {contactEmail}
                  </p>
                )}
              </div>
            )}

            <p className="text-sm text-gray-600 mb-6">
              Please save this ID for future reference. You can track your complaint status using
              this ID in the Help & Support section.
            </p>
            <Button onClick={resetForm} className="bg-red-600 hover:bg-red-700">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Report Issue with Bus
          </DialogTitle>
          <DialogDescription>
            Bus {busId} • Route {routeNumber}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">Issue Category *</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select issue category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please describe the issue in detail..."
              rows={4}
              required
              className="resize-none"
            />
          </div>

          {/* Camera/Photo Section */}
          <div className="space-y-2">
            <Label>Add Photo Evidence (Optional)</Label>
            
            {!capturedImage && !isCameraActive && (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={startCamera}
                  className="flex-1"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}

            {/* Camera View */}
            {isCameraActive && (
              <Card className="p-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg mb-3"
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={capturePhoto}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Capture
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={stopCamera}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            )}

            {/* Image Preview */}
            {capturedImage && (
              <Card className="p-4">
                <div className="relative">
                  <img
                    src={capturedImage}
                    alt="Captured evidence"
                    className="w-full rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-2">Photo attached successfully</p>
              </Card>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <Label>Contact Information (Optional - for follow-up)</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Name</Label>
                <Input
                  id="contactName"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Phone</Label>
                <Input
                  id="contactPhone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="Your phone number"
                  type="tel"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email</Label>
              <Input
                id="contactEmail"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="Your email address"
                type="email"
              />
            </div>

            {/* Notification Preferences */}
            {(contactPhone || contactEmail) && (
              <div className="space-y-3 pt-2 border-t">
                <Label className="text-sm">Notification Preferences</Label>
                <p className="text-xs text-gray-500">
                  Get updates about your complaint status
                </p>
                
                {contactPhone && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="notifySMS"
                      checked={notifySMS}
                      onCheckedChange={(checked) => setNotifySMS(checked as boolean)}
                    />
                    <Label
                      htmlFor="notifySMS"
                      className="text-sm cursor-pointer flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                      Send SMS updates to {contactPhone}
                    </Label>
                  </div>
                )}
                
                {contactEmail && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="notifyEmail"
                      checked={notifyEmail}
                      onCheckedChange={(checked) => setNotifyEmail(checked as boolean)}
                    />
                    <Label
                      htmlFor="notifyEmail"
                      className="text-sm cursor-pointer flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4 text-green-600" />
                      Send email updates to {contactEmail}
                    </Label>
                  </div>
                )}

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-blue-800">
                    You'll receive notifications when your complaint is acknowledged, under review, and resolved.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700"
              disabled={isSubmitting || !category || !description}
            >
              {isSubmitting ? "Submitting..." : "Submit Complaint"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
