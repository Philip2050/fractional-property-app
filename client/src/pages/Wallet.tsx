import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Wallet as WalletIcon, Copy, ExternalLink, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Wallet() {
  const { isAuthenticated, user } = useAuth();

  const { data: wallet, isLoading } = trpc.wallet.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: transactions } = trpc.transactions.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Sign in to View Wallet</h1>
          <p className="text-slate-300 mb-8">Please sign in to access your cryptocurrency wallet.</p>
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleCopyAddress = () => {
    if (wallet?.walletAddress) {
      navigator.clipboard.writeText(wallet.walletAddress);
      toast.success("Wallet address copied!");
    }
  };

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
            <Link href="/portfolio">
              <Button variant="outline" className="text-slate-200 border-slate-600 hover:bg-slate-700">
                Portfolio
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-2">Crypto Wallet</h1>
        <p className="text-slate-300">Manage your cryptocurrency and fund your investments</p>
      </section>

      {/* Wallet Info */}
      <section className="max-w-7xl mx-auto px-4 mb-12">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : wallet ? (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Wallet Card */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <WalletIcon className="w-6 h-6 text-blue-500" />
                    Your Wallet
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Balance Display */}
                  <div className="bg-slate-700/50 p-6 rounded-lg">
                    <p className="text-slate-400 text-sm mb-2">Cryptocurrency Balance</p>
                    <p className="text-4xl font-bold text-blue-400">{wallet.balance} {wallet.cryptoType}</p>
                    <p className="text-slate-300 mt-2">≈ ₹{parseInt(wallet.balanceInRupees).toLocaleString()}</p>
                  </div>

                  {/* Wallet Address */}
                  <div>
                    <p className="text-slate-400 text-sm mb-2">Wallet Address</p>
                    <div className="flex items-center gap-2 bg-slate-700/50 p-4 rounded-lg">
                      <code className="text-slate-300 font-mono text-sm flex-1 truncate">{wallet.walletAddress}</code>
                      <button
                        onClick={handleCopyAddress}
                        className="p-2 hover:bg-slate-600 rounded transition"
                      >
                        <Copy className="w-4 h-4 text-slate-300" />
                      </button>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Deposit {wallet.cryptoType}
                    </Button>
                    <Button variant="outline" className="text-slate-200 border-slate-600 hover:bg-slate-700">
                      Withdraw
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Wallet Stats */}
            <div className="space-y-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-slate-300 text-sm font-medium">Crypto Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-white">{wallet.cryptoType}</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-slate-300 text-sm font-medium">Exchange Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-white">1 {wallet.cryptoType} = ₹75,000</p>
                  <p className="text-slate-400 text-xs mt-2">Mock rate for demo</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-slate-300 text-sm font-medium">Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-white font-semibold">Active</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="py-12 text-center">
              <WalletIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-300">No wallet found. Please contact support.</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Transaction History */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Transaction History</h2>
        {transactions && transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.map((tx: any) => (
              <Card key={tx.id} className="bg-slate-800 border-slate-700 hover:border-blue-500 transition">
                <CardContent className="py-4">
                  <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-white font-semibold capitalize">{tx.transactionType}</p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          tx.status === "completed" ? "bg-green-600/20 text-green-400" :
                          tx.status === "pending" ? "bg-yellow-600/20 text-yellow-400" :
                          "bg-red-600/20 text-red-400"
                        }`}>
                          {tx.status}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm">{new Date(tx.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">{tx.cryptoAmount} {wallet?.cryptoType}</p>
                      <p className="text-slate-300 text-sm">₹{parseInt(tx.amountInRupees).toLocaleString()}</p>
                    </div>
                  </div>
                  {tx.transactionHash && (
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <div className="flex items-center gap-2 text-xs">
                        <code className="text-slate-400 font-mono flex-1 truncate">{tx.transactionHash}</code>
                        <ExternalLink className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      </div>
                    </div>
                  )}
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
