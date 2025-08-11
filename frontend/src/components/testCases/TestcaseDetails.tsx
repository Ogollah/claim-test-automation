// TestcaseDetails.tsx
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Play, PlayIcon } from 'lucide-react';

interface TestcaseDetailsProps {
  title: string;
  testCases?: any[];
  onRunTests?: (selectedItems: string[]) => void;
  isRunning?: boolean;
}

export default function TestcaseDetails({ title, testCases, onRunTests, isRunning }: TestcaseDetailsProps) {
  const items = testCases || [];  
  const FormSchema = z.object({
    items: z.array(z.string()).refine((value) => value.length > 0, {
      message: "You have to select at least one item.",
    }),
  });

  const defaultSelectedItems = items.map(item => item.formData.title);
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: defaultSelectedItems,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (onRunTests) {
      onRunTests(data.items);
    } else {
      toast("You selected the following items", {
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(data, null, 2)}
            </code>
          </pre>
        ),
      });
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-500">{title}</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="items"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-gray-500'>Select Test Cases</FormLabel>
                <div className="grid grid-cols-2 gap-4">
                  {items.map((item) => (
                    <FormItem
                      key={item.formData.title}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(item.formData.title)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, item.formData.title])
                              : field.onChange(
                                  field.value?.filter((id) => id !== item.formData.title)
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {item.formData.title}
                      </FormLabel>
                    </FormItem>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="button" disabled={isRunning} className={`inline-flex items-center px-4 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              isRunning
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}>
            <Play className="-ml-1 mr-2 h-5 w-5 " />
            {isRunning ? 'Running...' : 'Run selected tests'}
          </Button>
        </form>
      </Form>
    </div>
  );
}