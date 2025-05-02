import { useRouter } from "next/router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  BookOpen,
  Wallet,
  ArrowRight,
  Plus,
  List,
  FileText,
} from "lucide-react";

export default function Home() {
  const router = useRouter();

  const features = [
    {
      title: "Identity Management",
      description: "Create and manage customer identities with comprehensive details",
      icon: Users,
      actions: [
        {
          label: "View All Identities",
          icon: List,
          href: "/identities/list",
        },
        {
          label: "Create Identity",
          icon: Plus,
          href: "/identities/create",
        },
      ],
    },
    {
      title: "Ledger Management",
      description: "Manage financial ledgers and track transactions",
      icon: BookOpen,
      actions: [
        {
          label: "View All Ledgers",
          icon: List,
          href: "/ledgers/list",
        },
        {
          label: "Create Ledger",
          icon: Plus,
          href: "/ledgers/create",
        },
      ],
    },
    {
      title: "Wallet Management",
      description: "Create and manage digital wallets for customers",
      icon: Wallet,
      actions: [
        {
          label: "View All Wallets",
          icon: List,
          href: "/wallets/list",
        },
        {
          label: "Create Wallet",
          icon: Plus,
          href: "/wallets/create",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Blnk Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A comprehensive platform for managing identities, ledgers, and wallets
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <feature.icon className="w-6 h-6 text-indigo-500" />
                  <CardTitle>{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <div className="space-y-3">
                  {feature.actions.map((action) => (
                    <Button
                      key={action.label}
                      variant="outline"
                      className="w-full justify-between"
                      onClick={() => router.push(action.href)}
                    >
                      <div className="flex items-center space-x-2">
                        <action.icon className="w-4 h-4" />
                        <span>{action.label}</span>
                      </div>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Getting Started
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Begin by creating an identity for your customer, then set up a ledger and
            wallet to start managing their financial transactions.
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              size="lg"
              onClick={() => router.push("/identities/create")}
              className="flex items-center space-x-2"
            >
              <Users className="w-5 h-5" />
              <span>Create Your First Identity</span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/identities/list")}
              className="flex items-center space-x-2"
            >
              <FileText className="w-5 h-5" />
              <span>View Documentation</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
