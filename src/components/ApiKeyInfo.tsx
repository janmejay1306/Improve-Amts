import { AlertCircle, ExternalLink } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

export function ApiKeyInfo() {
  return (
    <Card className="p-6 bg-blue-50 border-blue-200">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
        <div className="space-y-3">
          <h3 className="text-black">Google Maps API Key Required</h3>
          <p className="text-sm text-gray-700">
            To enable real-time bus tracking with Google Maps integration, you need to configure your Google Maps API key.
          </p>
          
          <div className="space-y-2 text-sm">
            <p className="text-gray-700">Steps to setup:</p>
            <ol className="list-decimal list-inside space-y-1 text-gray-600 ml-2">
              <li>Visit Google Cloud Console</li>
              <li>Create a project and enable Maps APIs</li>
              <li>Generate an API key</li>
              <li>Add the key to GOOGLE_MAPS_API_KEY environment variable</li>
            </ol>
          </div>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open('https://console.cloud.google.com/apis/credentials', '_blank')}
            className="mt-2"
          >
            Open Google Cloud Console
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
