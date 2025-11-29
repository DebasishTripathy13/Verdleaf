'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, Loader2, CheckCircle2, XCircle, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface VerificationResult {
  isVerified: boolean;
  confidence: number;
  actionType: string | null;
  description: string;
  suggestions: string[];
  detectedObjects: string[];
  environmentalImpact: string;
  pointsRecommended: number;
}

interface ImageUploaderProps {
  onVerify: (imageBase64: string, mimeType: string) => Promise<VerificationResult>;
  onSuccess?: (result: VerificationResult) => void;
  className?: string;
}

export function ImageUploader({ onVerify, onSuccess, className }: ImageUploaderProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    
    setMimeType(file.type);
    setResult(null);
    setError(null);
    
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });
  
  const handleVerify = async () => {
    if (!selectedImage) return;
    
    setIsVerifying(true);
    setError(null);
    
    try {
      const base64Data = selectedImage.split(',')[1];
      const verificationResult = await onVerify(base64Data, mimeType);
      setResult(verificationResult);
      
      if (verificationResult.isVerified && onSuccess) {
        onSuccess(verificationResult);
      }
    } catch (err) {
      setError('Failed to verify image. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleReset = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
  };
  
  return (
    <Card glass className={cn('w-full max-w-xl', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Camera className="w-5 h-5 text-emerald-400" />
          Verify Eco-Action
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Dropzone */}
        {!selectedImage ? (
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all',
              isDragActive
                ? 'border-emerald-500 bg-emerald-500/10'
                : 'border-gray-600 hover:border-emerald-500/50 hover:bg-gray-800/50'
            )}
          >
            <input {...getInputProps()} />
            <motion.div
              animate={{ y: isDragActive ? -5 : 0 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Upload className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-medium">
                  {isDragActive ? 'Drop your image here!' : 'Upload your eco-action photo'}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Drag & drop or click to select (max 10MB)
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
                <span className="px-2 py-1 rounded bg-gray-800">♻️ Recycling</span>
                <span className="px-2 py-1 rounded bg-gray-800">🌳 Tree Planting</span>
                <span className="px-2 py-1 rounded bg-gray-800">🏖️ Beach Cleanup</span>
                <span className="px-2 py-1 rounded bg-gray-800">🚌 Public Transit</span>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Image Preview */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900">
              <Image
                src={selectedImage}
                alt="Uploaded eco-action"
                fill
                className="object-contain"
              />
              
              {/* Verification Overlay */}
              <AnimatePresence>
                {isVerifying && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/70 flex items-center justify-center"
                  >
                    <div className="text-center space-y-3">
                      <Loader2 className="w-10 h-10 animate-spin text-emerald-400 mx-auto" />
                      <p className="text-white font-medium">Analyzing image...</p>
                      <p className="text-sm text-gray-400">AI is verifying your eco-action</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Actions */}
            {!result && !isVerifying && (
              <div className="flex gap-3">
                <Button onClick={handleReset} variant="outline" className="flex-1">
                  Choose Different
                </Button>
                <Button onClick={handleVerify} variant="eco" className="flex-1">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Verify Action
                </Button>
              </div>
            )}
          </div>
        )}
        
        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/30"
          >
            <div className="flex items-center gap-2 text-red-400">
              <XCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </motion.div>
        )}
        
        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Verification Status */}
              <div
                className={cn(
                  'p-4 rounded-xl border',
                  result.isVerified
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                )}
              >
                <div className="flex items-center gap-3">
                  {result.isVerified ? (
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-400" />
                  )}
                  <div>
                    <h3
                      className={cn(
                        'font-bold text-lg',
                        result.isVerified ? 'text-emerald-400' : 'text-red-400'
                      )}
                    >
                      {result.isVerified ? 'Verified! 🎉' : 'Not Verified'}
                    </h3>
                    <p className="text-sm text-gray-300">{result.description}</p>
                  </div>
                </div>
              </div>
              
              {/* Confidence Score */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Confidence Score</span>
                  <span className="text-white font-medium">
                    {Math.round(result.confidence * 100)}%
                  </span>
                </div>
                <Progress
                  value={result.confidence * 100}
                  className="h-2 bg-gray-700"
                  indicatorClassName={cn(
                    'transition-all',
                    result.confidence >= 0.8
                      ? 'bg-emerald-500'
                      : result.confidence >= 0.5
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  )}
                />
              </div>
              
              {/* Action Type & Impact */}
              {result.actionType && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-gray-800/50">
                    <p className="text-xs text-gray-400">Action Type</p>
                    <p className="font-medium text-white capitalize">
                      {result.actionType.replace('-', ' ')}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-800/50">
                    <p className="text-xs text-gray-400">Points Earned</p>
                    <p className="font-bold text-emerald-400">+{result.pointsRecommended}</p>
                  </div>
                </div>
              )}
              
              {/* Environmental Impact */}
              {result.environmentalImpact && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <p className="text-xs text-emerald-400 mb-1">🌍 Environmental Impact</p>
                  <p className="text-sm text-white">{result.environmentalImpact}</p>
                </div>
              )}
              
              {/* Detected Objects */}
              {result.detectedObjects.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-2">Detected in Image</p>
                  <div className="flex flex-wrap gap-2">
                    {result.detectedObjects.map((obj, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded-full text-xs bg-gray-800 text-gray-300"
                      >
                        {obj}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Suggestions */}
              {result.suggestions.length > 0 && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <p className="text-xs text-amber-400 mb-2">💡 Tips</p>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {result.suggestions.map((suggestion, i) => (
                      <li key={i}>• {suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Reset Button */}
              <Button onClick={handleReset} variant="outline" className="w-full">
                <ImageIcon className="w-4 h-4 mr-2" />
                Upload Another
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
