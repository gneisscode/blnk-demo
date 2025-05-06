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
  CreditCard,
} from "lucide-react";

export default function Home() {
  const router = useRouter();

  const features = [
    {
      title: "Identity Management",
      description: "Create and manage customer identities",
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
    {
      title: "Card Balances",
      description: "Create and manage card balances linked to customer identities",
      icon: CreditCard,
      actions: [
        {
          label: "View All Balances",
          icon: List,
          href: "/balances/list",
        },
        {
          label: "Create Balance",
          icon: Plus,
          href: "/balances/create",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen p-8 bg-black-main">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-yellow-main mb-6 animate-fade-in">
            Welcome to Wallet Management System
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            A comprehensive platform for managing customers, ledgers, and wallets
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {features.map((feature) => (
            <Card 
              key={feature.title} 
              className="hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/5 backdrop-blur-sm border-white/10 hover:border-yellow-main/30 hover:scale-[1.02]"
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <feature.icon className="w-7 h-7 text-yellow-main" />
                  <CardTitle className="text-yellow-main text-xl">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 mb-6 leading-relaxed">{feature.description}</p>
                <div className="space-y-3">
                  {feature.actions.map((action) => (
                    <Button
                      key={action.label}
                      variant="outline"
                      className="w-full justify-between hover:bg-yellow-main/10 hover:text-yellow-main border-white/20 text-white transition-colors duration-200"
                      onClick={() => router.push(action.href)}
                    >
                      <div className="flex items-center space-x-2 cursor-pointer">
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

        <div className="mt-10 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold text-yellow-main mb-6">
            Getting Started
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Begin by creating an identity for your customer, then set up a ledger and
            wallet to start managing their financial transactions.
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              size="lg"
              onClick={() => router.push("/identities/create")}
              className="flex items-center space-x-2 bg-yellow-main text-black-main cursor-pointer hover:bg-yellow-main/90 transition-colors duration-200"
            >
              <Users className="w-5 h-5" />
              <span>Create Your First Identity</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
