import { Table } from "antd";
import { useCrypto } from "../context/crypto-context";
import type { ColumnsType } from "antd/es/table";

interface TableRow {
  key: string;
  name: string | undefined;
  price: string;
  amount: string;
}

const columns: ColumnsType<TableRow> = [
  {
    title: "Name",
    dataIndex: "name",
    showSorterTooltip: { target: "full-header" },
    sorter: (a, b) => (a.name ?? "").length - (b.name ?? "").length,
    sortDirections: ["descend"],
  },
  {
    title: "Price, $",
    dataIndex: "price",
    defaultSortOrder: "descend",
    sorter: (a, b) => Number(a.price) - Number(b.price),
  },
  {
    title: "Amount",
    dataIndex: "amount",
    defaultSortOrder: "descend",
    sorter: (a, b) => Number(a.amount) - Number(b.amount),
  },
];

export default function AssetsTable() {
  const { portfolio } = useCrypto();

  const data = portfolio.map((a) => ({
    key: a.id,
    name: a.name,
    price: a.price.toFixed(2),
    amount: a.amount.toFixed(4),
  }));

  return (
    <Table
      pagination={false}
      columns={columns}
      dataSource={data}
      showSorterTooltip={{ target: "sorter-icon" }}
    />
  );
}
