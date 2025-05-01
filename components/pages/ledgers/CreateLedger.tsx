import React, { useState, useEffect } from "react";
import { ledgerService } from "@/services/ledgerService";
import { useRouter } from "next/router";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Ledger } from "@/services/ledgerService";

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

export const CreateLedger = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [ledgers, setLedgers] = useState<Ledger[]>([]);
  const [fetchingLedgers, setFetchingLedgers] = useState(false);
  useEffect(() => {
    const fetchLedgers = async () => {
      setFetchingLedgers(true);
      try {
        const response = await fetch("/api/ledgers");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setLedgers(data);
      } catch (err: any) {
        toast.error("Failed to fetch ledgers", {
          description:
            err.message || "An error occurred while fetching ledgers.",
          duration: 5000,
        });
      } finally {
        setFetchingLedgers(false);
      }
    };

    fetchLedgers();
  }, []);
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
      router.push("/ledgers");
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
    <div className="container max-w-4xl py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-none shadow-lg bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Create New Ledger
            </CardTitle>
            <CardDescription className="text-gray-500">
              Set up a new ledger to manage your financial transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Ledger Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter ledger name"
                          {...field}
                          className="bg-white"
                        />
                      </FormControl>
                      <FormDescription>
                        A unique name for your ledger
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="meta_data.project_owner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Project Owner
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter project owner"
                          {...field}
                          className="bg-white"
                        />
                      </FormControl>
                      <FormDescription>
                        The organization or individual managing this ledger
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="meta_data.description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter description"
                          {...field}
                          className="bg-white min-h-[100px]"
                        />
                      </FormControl>
                      <FormDescription>
                        Detailed description of the ledger's purpose
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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

        <Card className="border-none shadow-lg bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Existing Ledgers
            </CardTitle>
            <CardDescription className="text-gray-500">
              List of all your ledgers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {fetchingLedgers ? (
              <div className="flex justify-center items-center h-32">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : ledgers.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No ledgers found</p>
            ) : (
              <div className="space-y-4">
                {ledgers.map((ledger) => (
                  <div
                    key={ledger.ledger_id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-semibold text-lg">{ledger.name}</h3>
                    <p className="text-sm text-gray-500">
                      {ledger.meta_data?.description ||
                        "No description provided"}
                    </p>
                    <div className="mt-2 text-xs text-gray-400">
                      Created:{" "}
                      {new Date(ledger.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
