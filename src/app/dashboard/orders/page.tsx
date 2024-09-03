"use client";
import React from "react";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addOrders, deleteOrders, getOrders } from "@/actions/orders.action";
import { Order, Product } from "@/lib/schemas/db";
import { fr } from "date-fns/locale";
import { format } from "date-fns";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getProducts } from "@/actions/products.action";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn, FormatCFA } from "@/lib/utils";

const formSchema = z.object({
  productId: z.string().min(1, "Le produit est obligatoire"),
  quantity: z.number().min(1, "La quantité doit être positive"),
});

const Page = () => {
  const queryClient = useQueryClient();

  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => await getOrders(),
    placeholderData: [],
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => await getProducts(),
    placeholderData: [],
    initialData: [],
  });

  const createOrderMutation = useMutation({
    mutationFn: async (order: z.infer<typeof formSchema>) =>
      await addOrders(order),
    onSuccess: () => {
      toast.success("La commande a bien été créée");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: () => {
      toast.error("Une erreur est survenue lors de la création");
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: async (orderId: string) => await deleteOrders(orderId),
    onSuccess: () => {
      toast.success("La commande a bien été supprimée");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: () => {
      toast.error("Une erreur est survenue lors de la suppression");
    },
  });

  const TABLE_COLUMNS = [
    {
      title: "Produit",
      row: (order: Order & Record<"product", Product>) => (
        <TableCell className="font-medium">{order.product.name}</TableCell>
      ),
    },
    {
      title: "Créée le",
      row: (order: Order) => (
        <TableCell>
          {format(new Date(order.createdAt).toLocaleDateString(), "dd LLL y", {
            locale: fr,
          })}
        </TableCell>
      ),
    },
    {
      title: "Quantité",
      row: (order: Order) => (
        <TableCell className="text-right">{order.quantity}</TableCell>
      ),
      style: {
        align: "right",
      },
    },
    {
      title: "PU",
      row: (order: Order & Record<"product", Product>) => (
        <TableCell className="text-right">
          {FormatCFA(order.product.price)}
        </TableCell>
      ),
      style: {
        align: "right",
      },
    },
    {
      title: "Total",
      row: (order: Order & Record<"product", Product>) => (
        <TableCell className="text-right">
          {order.quantity * order.product.price}
        </TableCell>
      ),
      style: {
        align: "right",
        width: "250px",
      },
    },
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: "",
      quantity: 1,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createOrderMutation.mutate(values);
  }

  const maxQuantity =
    products.filter((p) => p.id === form.watch("productId"))[0]
      ?.quantityInStock || 0;

  return (
    <div className={"flex flex-col gap-12 px-20"}>
      <Header
        title={"Commandes"}
        actions={[
          <Credenza key={"new_order"}>
            <CredenzaTrigger asChild>
              <Button className={"text-xs font-medium gap-1"}>
                <span className={"text-xl"}>+</span>
                <span>Nouvelle commande</span>
              </Button>
            </CredenzaTrigger>
            <CredenzaContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <CredenzaHeader>
                    <CredenzaTitle>Nouvelle commande</CredenzaTitle>
                    <CredenzaDescription>
                      Créez une nouvelle commande
                    </CredenzaDescription>
                  </CredenzaHeader>
                  <CredenzaBody className={"space-y-6"}>
                    <FormField
                      control={form.control}
                      name="productId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Produit</FormLabel>
                          <FormControl>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                      "w-full justify-between",
                                      !field.value && "text-muted-foreground",
                                    )}
                                  >
                                    {field.value
                                      ? products.find(
                                          (product) =>
                                            product.id === field.value,
                                        )?.name
                                      : "Selectionner un produit"}
                                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput
                                    placeholder="Cherchez un produit..."
                                    className="h-9"
                                  />
                                  <CommandList>
                                    <CommandEmpty>
                                      Aucun produit trouvé.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {products
                                        .filter(
                                          (product) =>
                                            product.quantityInStock > 0,
                                        )
                                        .map((product) => (
                                          <CommandItem
                                            value={product.id}
                                            key={product.id}
                                            onSelect={() => {
                                              form.setValue(
                                                "productId",
                                                product.id,
                                              );
                                            }}
                                          >
                                            {product.name}
                                            <CheckIcon
                                              className={cn(
                                                "ml-auto h-4 w-4",
                                                product.id === field.value
                                                  ? "opacity-100"
                                                  : "opacity-0",
                                              )}
                                            />
                                          </CommandItem>
                                        ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantité</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Saisissez la quantité"
                              {...field}
                              min={1}
                              max={maxQuantity}
                              onChange={(e) => {
                                form.setValue(
                                  "quantity",
                                  Number(e.target.value),
                                );
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CredenzaBody>
                  <CredenzaFooter>
                    <Button
                      disabled={createOrderMutation.isPending}
                      className={"gap-2"}
                      type={"submit"}
                    >
                      Confirmer{" "}
                      {createOrderMutation.isPending && (
                        <Loader2 size={16} className={"animate-spin"} />
                      )}
                    </Button>
                    <CredenzaClose asChild>
                      <Button
                        variant={"destructive"}
                        disabled={createOrderMutation.isPending}
                      >
                        Annuler
                      </Button>
                    </CredenzaClose>
                  </CredenzaFooter>
                </form>
              </Form>
            </CredenzaContent>
          </Credenza>,
        ]}
      />
      <Table>
        <TableHeader>
          <TableRow>
            {TABLE_COLUMNS.map((column, index) => (
              <TableHead
                key={index}
                style={{
                  width: column.style?.width ?? "auto",
                  textAlign: (column.style?.align ?? "left") as
                    | "left"
                    | "right"
                    | "center",
                }}
              >
                {column.title}
              </TableHead>
            ))}
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders?.map((order) => (
            <TableRow key={order.id} className={"cursor-pointer"}>
              {TABLE_COLUMNS.map((column, index) => (
                <React.Fragment key={index}>{column.row(order)}</React.Fragment>
              ))}
              <TableCell className="flex justify-end items-center gap-2">
                <Credenza>
                  <CredenzaTrigger asChild>
                    <Button variant={"destructive"} size={"icon"}>
                      <Trash2 size={18} />
                    </Button>
                  </CredenzaTrigger>
                  <CredenzaContent>
                    <CredenzaHeader>
                      <CredenzaTitle>Supprimer</CredenzaTitle>
                      <CredenzaDescription>
                        Confirmation de la suppression de cet élément
                      </CredenzaDescription>
                    </CredenzaHeader>
                    <CredenzaBody>
                      <span>
                        Êtes-vous sûr de vouloir supprimer cet élément ?
                      </span>
                    </CredenzaBody>
                    <CredenzaFooter>
                      <Button
                        disabled={deleteOrderMutation.isPending}
                        onClick={() => deleteOrderMutation.mutate(order.id)}
                        className={"gap-2"}
                      >
                        Confirmer{" "}
                        {deleteOrderMutation.isPending && (
                          <Loader2 size={16} className={"animate-spin"} />
                        )}
                      </Button>
                      <CredenzaClose asChild>
                        <Button
                          variant={"destructive"}
                          disabled={deleteOrderMutation.isPending}
                        >
                          Annuler
                        </Button>
                      </CredenzaClose>
                    </CredenzaFooter>
                  </CredenzaContent>
                </Credenza>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
