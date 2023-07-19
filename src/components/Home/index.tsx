/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ColumnDef, createColumnHelper, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { getTransactions } from "../../api/api";
import "./styles.scss";

interface Data {
  data: string;
  value: number;
  type: string;
  payerName: string;
}

const columnHelper = createColumnHelper<Data>();

const columns: ColumnDef<Data>[] = [
  columnHelper.group({
    id: "table",
    columns: [
      columnHelper.accessor("data", {
        header: "Data",
        cell: (info) => info.getValue() as string,
      }),
      columnHelper.accessor("value", {
        header: "Valor",
        cell: (info) => info.getValue() as string,
      }),
      columnHelper.accessor("type", {
        header: "Tipo",
        cell: (info) => info.getValue() as string,
      }),
      columnHelper.accessor("payerName", {
        header: "Responsável",
        cell: (info) => info.getValue() as string,
      }),
    ],
  }),
];

let data: Data[] = [];

export function Home() {
  const [saldoTotal, setsaldoTotal] = useState(0);
  const [saldoPeriodo, setsaldoPeriodo] = useState();
  const [transaction, setTransaction] = useState<Data[]>([]);

  useEffect(() => {
    const getData = async () => {
      const result: Data[] = await getTransactions();
      data = result;

      let totalSaldo = 0;
      result.map((transaction) => {
        totalSaldo = totalSaldo + transaction.value;

        switch (transaction.type) {
          case "DEPOSIT":
            transaction.type = "Depósito";
            break;
          case "WITHDRAW":
            transaction.type = "Saque";
            break;
          case "ENTER":
            transaction.type = "Entrada";
            break;
          case "EXIT":
            transaction.type = "Saída";
            break;
        }
      });

      setTransaction(result);
      setsaldoTotal(totalSaldo);
    };

    table.setPageSize(4);

    getData().catch((error) => {
      console.error(error);
    });
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="container">
      <div className="container-search-bar">
        <div className="container-inputs">
          <div className="input-group">
            <label>Data de início</label>
            <input type="text" />
          </div>
          <div className="input-group">
            <label>Data de Fim</label>
            <input type="text" />
          </div>
          <div className="input-group transacionado">
            <label>Nome do operador transacionado</label>
            <input type="text" />
          </div>
        </div>

        <div className="btn-search">
          <button>pesquisar</button>
        </div>
      </div>

      <div className="container-table">
        <div className="saldos">
          <span>Saldo total: {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(saldoTotal)}</span>
          <span>Saldo no período: {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(saldoTotal)}</span>
        </div>

        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination-container">
          <div>
            <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
              {"<<"}
            </button>
            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              {"<"}
            </button>
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              {">"}
            </button>
            <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
              {">>"}
            </button>
          </div>

          <span>
            <div>Página</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
}
