import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, MapPin, TrendingUp, Home, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Marketplace() {
  const { isAuthenticated, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState("all");

  const { data: properties, isLoading } = trpc.properties.list.useQuery(undefined, {
    enabled: true,
  });

  const filteredProperties = properties?.filter((prop: any) => {
    const matchesSearch = prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prop.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = propertyType === "all" || prop.propertyType === propertyType;
    return matchesSearch && matchesType;
  }) || [];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Sign in to Browse Properties</h1>
          <p className="text-slate-300 mb-8">Please sign in to view and invest in properties.</p>
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

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
          <div className="flex gap-4 items-center">
            <span className="text-slate-300">Welcome, {user?.name}</span>
            <Link href="/portfolio">
              <Button variant="outline" className="text-slate-200 border-slate-600 hover:bg-slate-700">
                Portfolio
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
        <h1 className="text-4xl font-bold text-white mb-2">Property Marketplace</h1>
        <p className="text-slate-300">Discover and invest in premium properties starting from ₹1,000</p>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 mb-12">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search by property name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
          />
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger className="w-full md:w-48 bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="mixed">Mixed Use</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <Home className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-300">No properties found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property: any) => {
              const availableShares = property.totalShares - property.soldShares;
              const percentageSold = ((property.soldShares / property.totalShares) * 100).toFixed(1);

              return (
                <Card key={property.id} className="bg-slate-800 border-slate-700 hover:border-blue-500 transition overflow-hidden">
                  {property.imageUrl && (
                    <div className="h-48 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                      <img src={property.imageUrl} alt={property.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-white">{property.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 text-slate-300">
                      <MapPin className="w-4 h-4" />
                      {property.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Total Area</p>
                        <p className="text-white font-semibold">{property.totalArea.toLocaleString()} sqft</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Price per sqft</p>
                        <p className="text-white font-semibold">₹{parseInt(property.pricePerSqft).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Min. Investment</p>
                        <p className="text-white font-semibold">₹{(property.minShareSize * parseInt(property.pricePerSqft)).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Available</p>
                        <p className="text-blue-400 font-semibold">{availableShares} sqft</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-2">
                        <span>Sold</span>
                        <span>{percentageSold}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${percentageSold}%` }}
                        />
                      </div>
                    </div>

                    {/* Property Type Badge */}
                    <div className="flex items-center gap-2">
                      <span className="inline-block px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs font-semibold">
                        {property.propertyType}
                      </span>
                      {property.status === "available" && (
                        <span className="inline-block px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-xs font-semibold">
                          Available
                        </span>
                      )}
                    </div>

                    <Link href={`/property/${property.id}`}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        View Details & Invest
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
