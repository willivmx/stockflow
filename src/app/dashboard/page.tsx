"use client";
import React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ArrowUpRight,
  DollarSign,
  Package,
  Shapes,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { getOrders } from "@/actions/orders.action";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProducts } from "@/actions/products.action";
import { Order, Product } from "@/lib/schemas/db";
import { FormatCFA } from "@/lib/utils";

const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const Page = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const queryClient = useQueryClient();

  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => await getOrders(),
    placeholderData: [],
    initialData: [],
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => await getProducts(),
    placeholderData: [],
    initialData: [],
  });

  const progression = (prev: number, next: number) => {
    let progression = ((next - prev) / prev) * 100;
    if (!isFinite(progression)) {
      progression = 100;
    }
    return `${progression >= 0 && "+"}${progression.toFixed(2)}%`;
  };

  const SUMMARY = [
    {
      title: "Total des ventes",
      icon: DollarSign,
      value: FormatCFA(
        orders.reduce(
          (acc, order) => acc + order.quantity * order.product.price,
          0,
        ),
      ),
      description: `${progression(
        orders
          .filter(
            (order) =>
              order.createdAt.getMonth() === new Date().getMonth() - 1 &&
              order.createdAt.getFullYear() === new Date().getFullYear(),
          )
          .reduce(
            (acc, order) => acc + order.quantity * order.product.price,
            0,
          ),
        orders
          .filter(
            (order) =>
              order.createdAt.getMonth() === new Date().getMonth() &&
              order.createdAt.getFullYear() === new Date().getFullYear(),
          )
          .reduce(
            (acc, order) => acc + order.quantity * order.product.price,
            0,
          ),
      )} par rapport au mois dernier`,
    },
    {
      title: "Total des commandes",
      icon: ShoppingCart,
      value: orders.length,
      description: `${progression(
        orders.filter(
          (order) =>
            order.createdAt.getMonth() === new Date().getMonth() - 1 &&
            order.createdAt.getFullYear() === new Date().getFullYear(),
        ).length,
        orders.filter(
          (order) =>
            order.createdAt.getMonth() === new Date().getMonth() &&
            order.createdAt.getFullYear() === new Date().getFullYear(),
        ).length,
      )} par rapport au mois dernier`,
    },
    {
      title: "Produits en stock",
      icon: Package,
      value: products.reduce(
        (acc, product) => acc + product.quantityInStock,
        0,
      ),
      description: `${progression(
        products
          .filter(
            (product) =>
              product.createdAt.getMonth() < new Date().getMonth() &&
              product.createdAt.getFullYear() === new Date().getFullYear(),
          )
          .reduce((acc, product) => acc + product.quantityInStock, 0),
        products
          .filter(
            (product) =>
              product.createdAt.getMonth() === new Date().getMonth() &&
              product.createdAt.getFullYear() === new Date().getFullYear(),
          )
          .reduce((acc, product) => acc + product.quantityInStock, 0),
      )} par rapport au mois dernier`,
    },
    {
      title: "Valeur du stock",
      icon: DollarSign,
      value: FormatCFA(
        products.reduce(
          (acc, product) => acc + product.price * product.quantityInStock,
          0,
        ),
      ),
      description: `${progression(
        products
          .filter(
            (product) =>
              product.createdAt.getMonth() < new Date().getMonth() &&
              product.createdAt.getFullYear() === new Date().getFullYear(),
          )
          .reduce(
            (acc, product) => acc + product.price * product.quantityInStock,
            0,
          ),
        products
          .filter(
            (product) =>
              product.createdAt.getMonth() === new Date().getMonth() &&
              product.createdAt.getFullYear() === new Date().getFullYear(),
          )
          .reduce(
            (acc, product) => acc + product.price * product.quantityInStock,
            0,
          ),
      )} par rapport au mois dernier`,
    },
  ];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {SUMMARY.map((item, index) => {
          return (
            <Card x-chunk={`dashboard-01-chunk-${index + 1}`} key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {item.title}
                </CardTitle>
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className={"w-full"}>
        <SalesChart orders={orders} />
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <LastSalesHistory orders={orders} />
        <InventoryMovements products={products} orders={orders} />
      </div>
    </main>
  );
};

export default Page;

const SalesChart = ({
  orders,
}: {
  orders: (Order & Record<"product", Product>)[];
}) => {
  const chartData = orders
    .filter(
      (order) =>
        order.createdAt.getMonth() >= new Date().getMonth() - 2 &&
        order.createdAt.getFullYear() === new Date().getFullYear(),
    )
    .map((order) => {
      return {
        date: order.createdAt.toISOString().slice(0, 10),
        totalSales: order.quantity * order.product.price,
      };
    });

  const chartConfig = {
    totalSales: {
      label: "Total",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Mouvements des ventes</CardTitle>
          <CardDescription>
            Mouvements des ventes sur les 3 derniers mois.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="totalSales"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Line
              dataKey={"totalSales"}
              type="monotone"
              stroke={`var(--color-totalSales)`}
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const LastSalesHistory = ({
  orders,
}: {
  orders: (Order & Record<"product", Product>)[];
}) => {
  return (
    <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Historique des ventes</CardTitle>
          <CardDescription>Les 5 denières ventes enregistrées.</CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="/dashboard/orders">
            Tout voir
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produit</TableHead>
              <TableHead className="text-right">Montant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>
                    <div className="font-medium">{order.product.name}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    {FormatCFA(order.product.price * order.quantity)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {orders.length === 0 && (
          <div
            className={
              "py-16 text-center text-sm flex flex-col items-center justify-center gap-4"
            }
          >
            <Shapes size={40} />
            Aucune commande trouvée
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const InventoryMovements = ({
  products,
  orders,
}: {
  products: Product[];
  orders: Order[];
}) => {
  const chartData = MONTHS.slice(
    new Date().getMonth() - 5,
    new Date().getMonth() + 1,
  ).map((month, index) => {
    return {
      month,
      inStock: products.filter(
        (product) =>
          product.createdAt.getMonth() === new Date().getMonth() - (5 - index),
      ).length,
      outStock: orders
        .filter(
          (order) =>
            order.createdAt.getMonth() === new Date().getMonth() - (5 - index),
        )
        .reduce((acc, order) => acc + order.quantity, 0),
    };
  });

  const chartConfig = {
    inStock: {
      label: "Entrée",
      color: "hsl(var(--chart-1))",
    },
    outStock: {
      label: "Sorties",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mouvements de stock</CardTitle>
        <CardDescription>
          {new Date().getMonth() - 5 < 0
            ? MONTHS[0]
            : MONTHS[new Date().getMonth() - 5]}{" "}
          - {MONTHS[new Date().getMonth()]} {new Date().getFullYear()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 4)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="inStock" fill="var(--color-inStock)" radius={4} />
            <Bar dataKey="outStock" fill="var(--color-outStock)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Mouvements de stock sur les 6 derniers mois.
        </div>
      </CardFooter>
    </Card>
  );
};
