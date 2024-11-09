"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Printer, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Tiffin {
  _id: string;
  name: string;
  mobileNumber: string;
  region: string;
  village: string;
  lunchCount: number;
  dinnerCount: number;
  paymentStatus: "pending" | "received";
  totalBill: number;
}

export default function TodaysTiffins() {
  const [tiffins, setTiffins] = useState<Tiffin[]>([]);
  const [allTiffins, setAllTiffins] = useState<Tiffin[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentMeal, setCurrentMeal] = useState<"lunch" | "dinner" | null>(
    null
  );
  const [updatingPayment, setUpdatingPayment] = useState<string | null>(null);

  const fetchTiffins = async (meal: "lunch" | "dinner") => {
    setLoading(true);
    try {
      const response = await fetch(`/api/get-tiffin?meal=${meal}`);
      if (response.ok) {
        const data = await response.json();
        setTiffins(data.tiffins);
        setCurrentMeal(meal);
      } else {
        alert("Failed to fetch tiffins");
      }
    } catch (error) {
      alert("Error fetching tiffins "+ error);
    }
    setLoading(false);
  };

  const fetchAllTiffins = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/get-all-tiffins");
      if (response.ok) {
        const data = await response.json();
        setAllTiffins(data.tiffins);
      } else {
        console.error("Failed to fetch all tiffins");
      }
    } catch (error) {
      alert("Error fetching all tiffins:"+error);
    }
    setLoading(false);
  };

  const updatePaymentStatus = async (id: string) => {
    setUpdatingPayment(id);
    try {
      const response = await fetch("/api/record-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        setAllTiffins(
          allTiffins.map((tiffin) =>
            tiffin._id === id
              ? { ...tiffin, paymentStatus: "received" }
              : tiffin
          )
        );
      } else {
        console.error("Failed to update payment status");
      }
    } catch (error) {
      alert("Error updating payment status:"+ error);
    }
    setUpdatingPayment(null);
  };

  const handlePrint = () => {
    const printContent = document.getElementById("printable-content");
    const winPrint = window.open(
      "",
      "",
      "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0"
    );

    if (printContent && winPrint) {
      winPrint.document.write(`
        <html>
          <head>
            <title>Print Tiffins</title>
            <style>
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f5f5f5; }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      winPrint.document.close();
      winPrint.focus();
      winPrint.print();
      winPrint.close();
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gray-50 space-y-8 py-8">
      <Card className="max-w-5xl mx-auto">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Today&apos;s Tiffins</h1>
            <div className="flex space-x-4">
              <Button
                onClick={() => fetchTiffins("lunch")}
                disabled={loading}
                variant={currentMeal === "lunch" ? "default" : "outline"}
              >
                Fetch Lunch Tiffins
              </Button>
              <Button
                onClick={() => fetchTiffins("dinner")}
                disabled={loading}
                variant={currentMeal === "dinner" ? "default" : "outline"}
              >
                Fetch Dinner Tiffins
              </Button>
            </div>
          </div>

          {loading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          )}

          {tiffins.length > 0 && (
            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                  {currentMeal === "lunch" ? "Lunch" : "Dinner"} Tiffins
                </h2>
                <Button size="sm" onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
              </div>
              <div id="printable-content" className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-gray-100">
                      <TableHead className="font-semibold border">
                        Name
                      </TableHead>
                      <TableHead className="font-semibold border">
                        Mobile
                      </TableHead>
                      <TableHead className="font-semibold border">
                        Region
                      </TableHead>
                      <TableHead className="font-semibold border">
                        Village
                      </TableHead>
                      <TableHead className="font-semibold border">
                        Count
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tiffins.map((tiffin) => (
                      <TableRow key={tiffin._id} className="hover:bg-gray-50">
                        <TableCell className="border">{tiffin.name}</TableCell>
                        <TableCell className="border">
                          {tiffin.mobileNumber}
                        </TableCell>
                        <TableCell className="border">
                          {tiffin.region}
                        </TableCell>
                        <TableCell className="border">
                          {tiffin.village}
                        </TableCell>
                        <TableCell className="border">
                          {currentMeal === "lunch"
                            ? tiffin.lunchCount
                            : tiffin.dinnerCount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {!loading && tiffins.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No tiffins found. Please fetch either lunch or dinner tiffins.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle>Record Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={fetchAllTiffins} disabled={loading}>
            List All Tiffins
          </Button>
          {allTiffins.length > 0 && (
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Village</TableHead>
                  <TableHead>Lunch Count</TableHead>
                  <TableHead>Dinner Count</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Total Bill</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allTiffins.map((tiffin) => (
                  <TableRow key={tiffin._id}>
                    <TableCell>{tiffin.name}</TableCell>
                    <TableCell>{tiffin.mobileNumber}</TableCell>
                    <TableCell>{tiffin.region}</TableCell>
                    <TableCell>{tiffin.village}</TableCell>
                    <TableCell>{tiffin.lunchCount}</TableCell>
                    <TableCell>{tiffin.dinnerCount}</TableCell>
                    <TableCell>{tiffin.totalBill}</TableCell>
                    <TableCell className={tiffin.paymentStatus === "pending" ? "text-red-500" : "text-green-500"}>{tiffin.paymentStatus}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => updatePaymentStatus(tiffin._id)}
                        disabled={
                          tiffin.paymentStatus === "received" ||
                          updatingPayment === tiffin._id
                        }
                        className={tiffin.paymentStatus === "pending" ? "bg-green-500" : "bg-gray-500"}
                        size="sm"
                      >
                        {updatingPayment === tiffin._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : tiffin.paymentStatus === "pending" ? (
                          "Mark as Received"
                        ) : (
                          "Received"
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
