import React, { useState } from "react";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Ledger name must be at least 2 characters.",
  }),
  meta_data: z.object({
    project_owner: z.string().min(2, {
      message: "Project owner must be at least 2 characters.",
    }),
    description: z.string().min(10, {
      message: "Description must be at least 10 characters.",
    }),
  }),
});

export default function CreateLedgerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      meta_data: {
        project_owner: "",
        description: "",
      },
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      const response = await fetch('/api/ledgers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      toast.success("Ledger created successfully!", {
        description: `Ledger "${values.name}" has been created.`,
        duration: 5000,
      });
      router.push("/ledgers/list");
    } catch (err: any) {
      toast.error("Failed to create ledger", {
        description:
          err.message || "An error occurred while creating the ledger.",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-black-main">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 flex items-center space-x-2 text-yellow-main hover:text-yellow-main/90 hover:bg-yellow-main/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Ledgers</span>
        </Button>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-yellow-main">Create New Ledger</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/90">Ledger Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter ledger name"
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-yellow-main/50 focus:ring-yellow-main/20"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-white/70">
                        A unique name for your ledger
                      </FormDescription>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="meta_data.project_owner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/90">Project Owner</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter project owner"
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-yellow-main/50 focus:ring-yellow-main/20"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-white/70">
                        The organization or individual managing this ledger
                      </FormDescription>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="meta_data.description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/90">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter description"
                          className="min-h-[100px] bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-yellow-main/50 focus:ring-yellow-main/20"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-white/70">
                        Detailed description of the ledger's purpose
                      </FormDescription>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-yellow-main text-black-main hover:bg-yellow-main/90 transition-colors duration-200"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-black-main border-t-transparent rounded-full animate-spin" />
                        Creating...
                      </div>
                    ) : (
                      "Create Ledger"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
