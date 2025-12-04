import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Building2, Coins, TrendingUp, Lock } from "lucide-react";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Building2 className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold text-white">PropertyShare</span>
          </div>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/marketplace">
                  <Button variant="outline" className="text-slate-200 border-slate-600 hover:bg-slate-700">
                    Marketplace
                  </Button>
                </Link>
                <Link href="/portfolio">
                  <Button variant="outline" className="text-slate-200 border-slate-600 hover:bg-slate-700">
                    Portfolio
                  </Button>
                </Link>
              </>
            ) : (
              <a href={getLoginUrl()}>
                <Button className="bg-blue-600 hover:bg-blue-700">Sign In</Button>
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Own Real Estate with <span className="text-blue-500">Crypto</span>
        </h1>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          Start investing in premium properties with just ₹1,000 or 1 sqft. Blockchain-backed fractional ownership for everyone.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <Link href="/marketplace">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Explore Properties <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          ) : (
            <a href={getLoginUrl()}>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Get Started Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
          )}
          <Button size="lg" variant="outline" className="text-slate-200 border-slate-600 hover:bg-slate-700">
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">Why PropertyShare?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 transition">
            <CardHeader>
              <Coins className="w-8 h-8 text-blue-500 mb-2" />
              <CardTitle className="text-white">Low Entry Price</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">Start with just ₹1,000 or 1 sqft. No minimum investment barriers.</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 transition">
            <CardHeader>
              <Lock className="w-8 h-8 text-blue-500 mb-2" />
              <CardTitle className="text-white">Blockchain Secured</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">All transactions verified on blockchain. Transparent and immutable records.</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 transition">
            <CardHeader>
              <Building2 className="w-8 h-8 text-blue-500 mb-2" />
              <CardTitle className="text-white">Real Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">Invest in verified, premium real estate across major cities.</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 transition">
            <CardHeader>
              <TrendingUp className="w-8 h-8 text-blue-500 mb-2" />
              <CardTitle className="text-white">Passive Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">Earn rental income and appreciate with property value growth.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 bg-slate-800/50 rounded-lg my-12">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-blue-500 mb-2">₹500Cr+</p>
            <p className="text-slate-300">Total Assets Under Management</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-blue-500 mb-2">15K+</p>
            <p className="text-slate-300">Active Investors</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-blue-500 mb-2">50+</p>
            <p className="text-slate-300">Premium Properties</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">Ready to Start Investing?</h2>
        <p className="text-slate-300 mb-8 max-w-xl mx-auto">
          Join thousands of investors building wealth through fractional real estate ownership.
        </p>
        {isAuthenticated ? (
          <Link href="/marketplace">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Browse Properties <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        ) : (
          <a href={getLoginUrl()}>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Create Account <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </a>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400">
          <p>&copy; 2025 PropertyShare. All rights reserved. Blockchain-powered fractional real estate.</p>
        </div>
      </footer>
    </div>
  );
}
