// app/dashboard/categories/new/page.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  Eye, 
  Link, 
  Image as ImageIcon,
  Globe,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Loader2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Define form schema
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  handle: z.string()
    .min(2, 'Handle must be at least 2 characters')
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Handle can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().max(500).optional(),
  is_active: z.boolean().default(true),
  is_internal: z.boolean().default(false),
  has_parent: z.boolean().default(false),
  rank: z.number().min(0).max(100).default(0),
  parent_category_id: z.string().optional(),
  thumbnail: z.string().optional(),
  seo_id: z.string().optional(),
  structured_data: z.string().optional(),
  social_config: z.string().optional(),
  analytics_config: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Custom Input Component
interface CustomInputProps {
  name: keyof FormValues;
  control: any;
  placeholder: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  className?: string;
  errorMessage?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomInput = ({
  name,
  control,
  placeholder,
  type = "text",
  required = false,
  disabled = false,
  maxLength,
  className = "",
  errorMessage,
  onChange,
}: CustomInputProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="w-full">
          <Input
            placeholder={required ? placeholder : `${placeholder} (optional..)`}
            type={type}
            className={className}
            disabled={disabled}
            {...field}
            onChange={(e) => {
              onChange?.(e);
              field.onChange(e);
            }}
            maxLength={maxLength}
            value={field.value ?? ""}
          />
          {errorMessage && (
            <p className="text-red-600 text-sm pt-2">{errorMessage}</p>
          )}
        </div>
      )}
    />
  );
};

// Custom Textarea Component
interface CustomTextareaProps {
  name: keyof FormValues;
  control: any;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  className?: string;
  errorMessage?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const CustomTextarea = ({
  name,
  control,
  placeholder,
  required = false,
  disabled = false,
  maxLength,
  className = "",
  errorMessage,
  onChange,
}: CustomTextareaProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="w-full">
          <Textarea
            placeholder={required ? placeholder : `${placeholder} (optional..)`}
            disabled={disabled}
            className={`resize-none ${className}`}
            {...field}
            onChange={(e) => {
              onChange?.(e);
              field.onChange(e);
            }}
            maxLength={maxLength}
            value={field.value ?? ""}
          />
          {errorMessage && (
            <p className="text-red-600 text-sm pt-2">{errorMessage}</p>
          )}
        </div>
      )}
    />
  );
};

// Custom Switch Component
interface CustomSwitchProps {
  name: keyof FormValues;
  control: any;
  label: string;
  description: string;
  disabled?: boolean;
}

const CustomSwitch = ({
  name,
  control,
  label,
  description,
  disabled = false,
}: CustomSwitchProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <label className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {label}
            </label>
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          </div>
          <Switch
            checked={field.value}
            onCheckedChange={field.onChange}
            disabled={disabled}
          />
        </div>
      )}
    />
  );
};

// Custom Select Component
interface CustomSelectProps {
  name: keyof FormValues;
  control: any;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  label?: string;
  description?: string;
  disabled?: boolean;
  errorMessage?: string;
}

const CustomSelect = ({
  name,
  control,
  placeholder,
  options,
  label,
  description,
  disabled = false,
  errorMessage,
}: CustomSelectProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="w-full">
          {label && (
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
              {label}
            </label>
          )}
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={disabled}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && (
            <p className="text-sm text-muted-foreground mt-2">{description}</p>
          )}
          {errorMessage && (
            <p className="text-red-600 text-sm pt-2">{errorMessage}</p>
          )}
        </div>
      )}
    />
  );
};

export default function NewCategoryPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [categories, setCategories] = useState<Array<{ id: string; name: string; mpath: string }>>([]);
  const [uploadedThumbnail, setUploadedThumbnail] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      handle: '',
      description: '',
      is_active: true,
      is_internal: false,
      has_parent: false,
      rank: 0,
      parent_category_id: undefined,
    },
    mode: 'onChange',
  });

  // Watch for changes to update preview
  const watchedValues = watch();

  // Generate handle from name
  const generateHandle = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setAlertMessage('File size must be less than 2MB');
        setShowErrorAlert(true);
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        setAlertMessage('Only JPEG, PNG, and GIF files are allowed');
        setShowErrorAlert(true);
        return;
      }
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setUploadedThumbnail(previewUrl);
      setValue('thumbnail', file.name);
      
      setAlertMessage('Thumbnail uploaded successfully!');
      setShowSuccessAlert(true);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setShowSuccessAlert(false);
    setShowErrorAlert(false);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setAlertMessage('Category created successfully! Redirecting...');
      setShowSuccessAlert(true);
      
      // Redirect after delay
      setTimeout(() => {
        router.push('/dashboard/categories');
      }, 2000);
      
    } catch (error) {
      setAlertMessage('Failed to create category. Please try again.');
      setShowErrorAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: <Globe className="h-4 w-4" /> },
    { id: 'seo', label: 'SEO', icon: <Link className="h-4 w-4" /> },
    { id: 'media', label: 'Media', icon: <ImageIcon className="h-4 w-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'preview', label: 'Preview', icon: <Eye className="h-4 w-4" /> },
  ];

  // SEO options
  const seoOptions = [
    { value: 'default', label: 'Default SEO' },
    { value: 'optimized', label: 'Optimized for E-commerce' },
    { value: 'custom', label: 'Custom Profile' },
  ];

  // Analytics options
  const analyticsOptions = [
    { value: 'default', label: 'Default Tracking' },
    { value: 'enhanced', label: 'Enhanced E-commerce' },
    { value: 'custom', label: 'Custom Configuration' },
  ];

  // Schema options
  const schemaOptions = [
    { value: 'product', label: 'Product Schema' },
    { value: 'category', label: 'Category Schema' },
    { value: 'breadcrumb', label: 'Breadcrumb Schema' },
  ];

  // Social options
  const socialOptions = [
    { value: 'default', label: 'Default Sharing' },
    { value: 'enhanced', label: 'Enhanced Cards' },
    { value: 'custom', label: 'Custom Settings' },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Category</h1>
            <p className="text-muted-foreground">
              Add a new product category with SEO, analytics, and media settings
            </p>
          </div>
        </div>
      </motion.div>

      {/* Alerts */}
      {showSuccessAlert && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Alert variant="default" className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Success</AlertTitle>
            <AlertDescription className="text-green-700">
              {alertMessage}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {showErrorAlert && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {alertMessage}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Category Details
                </CardTitle>
                <CardDescription>
                  Fill in the basic information for your new product category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs 
                  value={activeTab} 
                  onValueChange={setActiveTab}
                  className="space-y-6"
                >
                  <TabsList className="grid grid-cols-5 w-full">
                    {tabs.map((tab) => (
                      <TabsTrigger 
                        key={tab.id} 
                        value={tab.id}
                        className="flex items-center gap-2"
                      >
                        {tab.icon}
                        <span className="hidden sm:inline">{tab.label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {/* Basic Info Tab */}
                  <TabsContent value="basic" className="space-y-6">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name Field */}
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium mb-2">
                            Category Name
                            <Badge variant="outline" className="text-xs">
                              Required
                            </Badge>
                          </label>
                          <CustomInput
                            name="name"
                            control={control}
                            placeholder="e.g., Electronics"
                            required={true}
                            className="h-11"
                            errorMessage={errors.name?.message}
                            onChange={(e) => {
                              if (!getValues('handle')) {
                                setValue('handle', generateHandle(e.target.value));
                              }
                            }}
                          />
                          <p className="text-sm text-muted-foreground mt-2">
                            The display name of your category
                          </p>
                        </div>

                        {/* Handle Field */}
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium mb-2">
                            URL Handle
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4"
                                  >
                                    <AlertCircle className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Used in URLs: yourstore.com/categories/[handle]</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                              /categories/
                            </div>
                            <Controller
                              control={control}
                              name="handle"
                              render={({ field }) => (
                                <Input
                                  placeholder="electronics"
                                  className="h-11 pl-32"
                                  {...field}
                                  value={field.value ?? ""}
                                />
                              )}
                            />
                          </div>
                          {errors.handle?.message && (
                            <p className="text-red-600 text-sm pt-2">{errors.handle.message}</p>
                          )}
                          <p className="text-sm text-muted-foreground mt-2">
                            Unique URL-friendly identifier
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Description
                        </label>
                        <Controller
                          control={control}
                          name="description"
                          render={({ field }) => (
                            <>
                              <Textarea
                                placeholder="Describe your category..."
                                className="min-h-[100px] resize-none"
                                {...field}
                                value={field.value ?? ""}
                              />
                              <div className="flex justify-between items-center mt-2">
                                <p className="text-sm text-muted-foreground">
                                  Brief description for your category
                                </p>
                                <span className="text-xs text-muted-foreground">
                                  {(field.value?.length || 0)}/500
                                </span>
                              </div>
                            </>
                          )}
                        />
                        {errors.description?.message && (
                          <p className="text-red-600 text-sm pt-2">{errors.description.message}</p>
                        )}
                      </div>

                      {/* Toggle Switches */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <CustomSwitch
                          name="is_active"
                          control={control}
                          label="Active Status"
                          description="Make category publicly visible"
                        />

                        <CustomSwitch
                          name="is_internal"
                          control={control}
                          label="Internal Use"
                          description="Hide from customers"
                        />

                        <CustomSwitch
                          name="has_parent"
                          control={control}
                          label="Parent Category"
                          description="Belongs to another category"
                        />
                      </div>

                      {/* Parent Category Selector */}
                      {watchedValues.has_parent && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                        >
                          <CustomSelect
                            name="parent_category_id"
                            control={control}
                            placeholder="Select a parent category"
                            options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                            label="Select Parent Category"
                            description="Choose the parent category if this is a sub-category"
                            errorMessage={errors.parent_category_id?.message}
                          />
                        </motion.div>
                      )}

                      {/* Rank Field */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Display Rank
                        </label>
                        <Controller
                          control={control}
                          name="rank"
                          render={({ field }) => (
                            <div className="flex items-center gap-4">
                              <Input
                                type="range"
                                min="0"
                                max="100"
                                step="1"
                                className="flex-1"
                                value={field.value}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                              <span className="w-16 text-center font-medium">
                                {field.value}
                              </span>
                            </div>
                          )}
                        />
                        {errors.rank?.message && (
                          <p className="text-red-600 text-sm pt-2">{errors.rank.message}</p>
                        )}
                        <p className="text-sm text-muted-foreground mt-2">
                          Higher rank appears first in listings
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* SEO Tab */}
                  <TabsContent value="seo" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Link className="h-5 w-5 text-primary" />
                          SEO Configuration
                        </CardTitle>
                        <CardDescription>
                          Optimize your category for search engines
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <CustomSelect
                          name="seo_id"
                          control={control}
                          placeholder="Select SEO profile"
                          options={seoOptions}
                          label="SEO Profile"
                          description="Choose an SEO configuration for this category"
                          errorMessage={errors.seo_id?.message}
                        />

                        <div className="rounded-lg border p-4 space-y-4">
                          <h3 className="font-semibold">SEO Preview</h3>
                          <div className="space-y-2">
                            <div className="text-blue-600 hover:underline cursor-pointer">
                              {watchedValues.name || "Your Category Name"}
                            </div>
                            <div className="text-green-700 text-sm">
                              yourstore.com/categories/{watchedValues.handle || "your-handle"}
                            </div>
                            <div className="text-gray-600 text-sm line-clamp-2">
                              {watchedValues.description || "Category description will appear here..."}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Media Tab */}
                  <TabsContent value="media" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <ImageIcon className="h-5 w-5 text-primary" />
                          Media Assets
                        </CardTitle>
                        <CardDescription>
                          Upload images and thumbnails for your category
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Category Thumbnail
                          </label>
                          <div className="space-y-4">
                            {uploadedThumbnail ? (
                              <div className="flex items-center gap-4">
                                <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                                  <img
                                    src={uploadedThumbnail}
                                    alt="Thumbnail preview"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm text-muted-foreground">
                                    Thumbnail uploaded: {getValues('thumbnail')}
                                  </p>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="mt-2"
                                    onClick={() => {
                                      setUploadedThumbnail(null);
                                      setValue('thumbnail', '');
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
                                <input
                                  type="file"
                                  className="hidden"
                                  id="thumbnail-upload"
                                  accept="image/jpeg,image/png,image/gif"
                                  onChange={handleFileUpload}
                                />
                                <label htmlFor="thumbnail-upload" className="cursor-pointer">
                                  <div className="flex flex-col items-center gap-2">
                                    <Upload className="h-8 w-8 text-muted-foreground" />
                                    <div>
                                      <p className="font-medium">Click to upload thumbnail</p>
                                      <p className="text-sm text-muted-foreground">
                                        PNG, JPG, GIF up to 2MB
                                      </p>
                                    </div>
                                  </div>
                                </label>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            Thumbnail image for category listings
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Analytics Tab */}
                  <TabsContent value="analytics" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-primary" />
                          Analytics Configuration
                        </CardTitle>
                        <CardDescription>
                          Configure tracking and analytics for this category
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <CustomSelect
                          name="analytics_config"
                          control={control}
                          placeholder="Select analytics configuration"
                          options={analyticsOptions}
                          label="Analytics Profile"
                          description="Choose how to track this category's performance"
                          errorMessage={errors.analytics_config?.message}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <CustomSelect
                            name="structured_data"
                            control={control}
                            placeholder="Select schema type"
                            options={schemaOptions}
                            label="Structured Data"
                            description="Rich snippet configuration"
                            errorMessage={errors.structured_data?.message}
                          />

                          <CustomSelect
                            name="social_config"
                            control={control}
                            placeholder="Social sharing settings"
                            options={socialOptions}
                            label="Social Configuration"
                            description="Social media sharing configuration"
                            errorMessage={errors.social_config?.message}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Preview Tab */}
                  <TabsContent value="preview" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Eye className="h-5 w-5 text-primary" />
                          Category Preview
                        </CardTitle>
                        <CardDescription>
                          Preview how your category will appear
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          className="border rounded-lg p-6 space-y-4"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                              {uploadedThumbnail ? (
                                <img
                                  src={uploadedThumbnail}
                                  alt="Category thumbnail"
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 space-y-2">
                              <h3 className="text-xl font-bold">
                                {watchedValues.name || "Category Name"}
                              </h3>
                              <p className="text-muted-foreground">
                                {watchedValues.description || "No description provided"}
                              </p>
                              <div className="flex items-center gap-2">
                                <Badge variant={watchedValues.is_active ? "default" : "secondary"}>
                                  {watchedValues.is_active ? "Active" : "Inactive"}
                                </Badge>
                                {watchedValues.is_internal && (
                                  <Badge variant="outline">Internal</Badge>
                                )}
                                <Badge variant="outline">
                                  Rank: {watchedValues.rank || 0}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-medium">URL Handle</p>
                              <p className="text-muted-foreground">
                                /categories/{watchedValues.handle || "..."}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium">SEO Status</p>
                              <p className="text-muted-foreground">
                                {watchedValues.seo_id ? "Configured" : "Not configured"}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium">Analytics</p>
                              <p className="text-muted-foreground">
                                {watchedValues.analytics_config ? "Enabled" : "Disabled"}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium">Visibility</p>
                              <p className="text-muted-foreground">
                                {watchedValues.is_internal ? "Internal Only" : "Public"}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
              
              {/* Form Actions */}
              <CardFooter className="flex justify-between border-t p-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Cancel
                </Button>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab('preview')}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isLoading}
                    className="gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Create Category
                      </>
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Setup Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Basic Information', completed: !!watchedValues.name && !!watchedValues.handle },
                  { label: 'SEO Configuration', completed: !!watchedValues.seo_id },
                  { label: 'Media Assets', completed: !!watchedValues.thumbnail },
                  { label: 'Analytics', completed: !!watchedValues.analytics_config },
                  { label: 'Review & Create', completed: isValid },
                ].map((step, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center 
                      ${step.completed ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      {step.completed ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <span className="text-xs">{index + 1}</span>
                      )}
                    </div>
                    <span className={`text-sm ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Info className="h-5 w-5 text-primary" />
                  Tips & Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium">SEO Optimization</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Use descriptive, keyword-rich names</li>
                    <li>Keep handles short and memorable</li>
                    <li>Add detailed descriptions (150-300 characters)</li>
                  </ul>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium">Category Structure</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Use parent categories for better organization</li>
                    <li>Set appropriate ranks for display order</li>
                    <li>Mark internal categories for staff use only</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => setActiveTab('seo')}
                >
                  <Link className="h-4 w-4" />
                  Configure SEO
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => setActiveTab('analytics')}
                >
                  <BarChart3 className="h-4 w-4" />
                  Setup Analytics
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => setActiveTab('media')}
                >
                  <ImageIcon className="h-4 w-4" />
                  Upload Images
                </Button>
              </CardContent>
            </Card>

            {/* Form Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Form Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${isValid ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <span className="text-sm">
                    {isValid ? 'All required fields completed' : 'Required fields pending'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {isValid ? 'Ready to submit the form' : 'Complete all required fields to submit'}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}