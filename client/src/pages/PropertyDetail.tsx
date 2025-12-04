import { useState } from "react";
import { useRoute } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, MapPin, Building2, TrendingUp, Loader2, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function PropertyDetail() {
  const [, params] = useRoute("/property/:id");
  const { isAuthenticated, user } = useAuth();
  const [sharesAmount, setSharesAmount] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionComplete, setTransactionComplete] = useState(false);

  const propertyId = params?.id ? parseInt(params.id) : 0;

  const { data: property, isLoading } = trpc.properties.get.useQuery(
    { id: propertyId },
    { enabled: propertyId > 0 }
  );

  const createTransactionMutation = trpc.transactions.create.useMutation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Sign in Required</h1>
          <p className="text-slate-300 mb-8">Please sign in to view property details and invest.</p>
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link href="/marketplace">
            <Button variant="outline" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketplace
            </Button>
          </Link>
          <div className="text-center py-12">
            <p className="text-slate-300">Property not found.</p>
          </div>
        </div>
      </div>
    );
  }

  const pricePerSqft = parseInt(property.pricePerSqft);
  const investmentAmount = sharesAmount * pricePerSqft;
  const cryptoAmount = (investmentAmount / 75000).toFixed(6); // Mock: 1 ETH = 75,000 INR
  const availableShares = property.totalShares - property.soldShares;

  const handleInvest = async () => {
    if (sharesAmount < property.minShareSize || sharesAmount > availableShares) {
      toast.error(`Please enter between ${property.minShareSize} and ${availableShares} sqft`);
      return;
    }

    setIsProcessing(true);
    try {
      await createTransactionMutation.mutateAsync({
        propertyId: property.id,
        sharesAmount,
        amountInRupees: investmentAmount.toString(),
        cryptoAmount: cryptoAmount,
        exchangeRate: "75000",
      });

      setTransactionComplete(true);
      toast.success("Investment initiated! Processing blockchain transaction...");

      setTimeout(() => {
        setTransactionComplete(false);
        setSharesAmount(1);
      }, 3000);
    } catch (error) {
      toast.error("Failed to process investment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const percentageSold = ((property.soldShares / property.totalShares) * 100).toFixed(1);

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
          <Link href="/marketplace">
            <Button variant="outline" className="text-slate-200 border-slate-600 hover:bg-slate-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Property Info */}
          <div className="lg:col-span-2">
            {property.imageUrl && (
              <div className="h-96 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg mb-8 flex items-center justify-center overflow-hidden">
                <img src={property.imageUrl} alt={property.title} className="w-full h-full object-cover" />
              </div>
            )}

            <Card className="bg-slate-800 border-slate-700 mb-8">
              <CardHeader>
                <CardTitle className="text-3xl text-white">{property.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 text-slate-300 text-base mt-2">
                  <MapPin className="w-5 h-5" />
                  {property.location}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-slate-300">{property.description}</p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <p className="text-slate-400 text-sm">Total Area</p>
                    <p className="text-2xl font-bold text-white">{property.totalArea.toLocaleString()} sqft</p>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <p className="text-slate-400 text-sm">Total Value</p>
                    <p className="text-2xl font-bold text-white">₹{parseInt(property.totalPrice).toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <p className="text-slate-400 text-sm">Price per sqft</p>
                    <p className="text-2xl font-bold text-blue-400">₹{pricePerSqft.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <p className="text-slate-400 text-sm">Property Type</p>
                    <p className="text-2xl font-bold text-white capitalize">{property.propertyType}</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-300">Sold: {property.soldShares} / {property.totalShares} sqft</span>
                    <span className="text-blue-400 font-semibold">{percentageSold}% Sold</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all"
                      style={{ width: `${percentageSold}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Investment Panel */}
          <div>
            <Card className="bg-slate-800 border-slate-700 sticky top-24">
              <CardHeader>
                <CardTitle className="text-white">Invest Now</CardTitle>
                <CardDescription className="text-slate-300">
                  {availableShares > 0 ? `${availableShares} sqft available` : "Sold Out"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {transactionComplete ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="text-green-400 font-semibold">Investment Initiated!</p>
                    <p className="text-slate-400 text-sm mt-2">Processing on blockchain...</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-slate-300 text-sm mb-2">Amount to Invest (sqft)</label>
                      <Input
                        type="number"
                        min={property.minShareSize}
                        max={availableShares}
                        value={sharesAmount}
                        onChange={(e) => setSharesAmount(Math.max(property.minShareSize, parseInt(e.target.value) || 0))}
                        className="bg-slate-700 border-slate-600 text-white"
                        disabled={availableShares === 0 || isProcessing}
                      />
                      <p className="text-slate-400 text-xs mt-1">Min: {property.minShareSize} sqft</p>
                    </div>

                    <div className="bg-slate-700/50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Investment Amount</span>
                        <span className="text-white font-semibold">₹{investmentAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Crypto Equivalent</span>
                        <span className="text-blue-400 font-semibold">{cryptoAmount} ETH</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-slate-600">
                        <span className="text-slate-300 font-semibold">Total</span>
                        <span className="text-white font-bold text-lg">₹{investmentAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={availableShares === 0 || isProcessing}
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Proceed to Payment"
                          )}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-800 border-slate-700">
                        <DialogHeader>
                          <DialogTitle className="text-white">Confirm Investment</DialogTitle>
                          <DialogDescription className="text-slate-300">
                            Review your investment details and confirm the blockchain transaction.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="bg-slate-700/50 p-4 rounded-lg space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Property</span>
                              <span className="text-white">{property.title}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Amount</span>
                              <span className="text-white">{sharesAmount} sqft</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Price</span>
                              <span className="text-white">₹{investmentAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Crypto</span>
                              <span className="text-blue-400">{cryptoAmount} ETH</span>
                            </div>
                          </div>
                          <Button
                            onClick={handleInvest}
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                            disabled={isProcessing}
                          >
                            {isProcessing ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              "Confirm & Invest"
                            )}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <p className="text-xs text-slate-400 text-center">
                      🔒 All transactions are secured by blockchain technology
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
