import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, TrendingUp, Wallet, Loader2, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Portfolio() {
  const { isAuthenticated, user } = useAuth();

  const { data: shares, isLoading: sharesLoading } = trpc.shares.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: transactions, isLoading: transactionsLoading } = trpc.transactions.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: wallet } = trpc.wallet.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Sign in to View Portfolio</h1>
          <p className="text-slate-300 mb-8">Please sign in to see your investments.</p>
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalInvested = shares?.reduce((sum: number, share: any) => sum + parseInt(share.investmentAmount), 0) || 0;
  const totalShares = shares?.reduce((sum: number, share: any) => sum + share.sharesOwned, 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <Building2 className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold text-white">PropertyShare</span>
            </div>
          </Link>
          <div className="flex gap-4">
            <Link href="/marketplace">
              <Button variant="outline" className="text-slate-200 border-slate-600 hover:bg-slate-700">
                Marketplace
              </Button>
            </Link>
            <Link href="/wallet">
              <Button variant="outline" className="text-slate-200 border-slate-600 hover:bg-slate-700">
                Wallet
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-2">Your Portfolio</h1>
        <p className="text-slate-300">Track your investments and property ownership</p>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 mb-12">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-slate-300 text-sm font-medium">Total Invested</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-white">₹{totalInvested.toLocaleString()}</p>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-slate-300 text-sm font-medium">Properties Owned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-white">{shares?.length || 0}</p>
                <Building2 className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-slate-300 text-sm font-medium">Total Area Owned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-white">{totalShares.toLocaleString()} sqft</p>
                <Wallet className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Holdings */}
      <section className="max-w-7xl mx-auto px-4 mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Your Holdings</h2>
        {sharesLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : shares && shares.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {shares.map((share: any) => (
              <Card key={share.id} className="bg-slate-800 border-slate-700 hover:border-blue-500 transition">
                <CardHeader>
                  <CardTitle className="text-white">Property #{share.propertyId}</CardTitle>
                  <CardDescription className="text-slate-300">
                    Purchased on {new Date(share.purchaseDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-400 text-sm">Area Owned</p>
                      <p className="text-white font-semibold">{share.sharesOwned} sqft</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Investment</p>
                      <p className="text-blue-400 font-semibold">₹{parseInt(share.investmentAmount).toLocaleString()}</p>
                    </div>
                  </div>
                  {share.transactionHash && (
                    <div className="bg-slate-700/50 p-3 rounded text-xs">
                      <p className="text-slate-400 mb-1">Blockchain Hash</p>
                      <p className="text-slate-300 break-all font-mono">{share.transactionHash}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="py-12 text-center">
              <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-300 mb-4">You haven't invested in any properties yet.</p>
              <Link href="/marketplace">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Explore Properties <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Recent Transactions */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Recent Transactions</h2>
        {transactionsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : transactions && transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.slice(0, 10).map((tx: any) => (
              <Card key={tx.id} className="bg-slate-800 border-slate-700">
                <CardContent className="py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-semibold capitalize">{tx.transactionType} {tx.sharesAmount} sqft</p>
                      <p className="text-slate-400 text-sm">{new Date(tx.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">₹{parseInt(tx.amountInRupees).toLocaleString()}</p>
                      <p className={`text-sm ${
                        tx.status === "completed" ? "text-green-400" :
                        tx.status === "pending" ? "text-yellow-400" :
                        "text-red-400"
                      }`}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="py-12 text-center">
              <p className="text-slate-300">No transactions yet.</p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
