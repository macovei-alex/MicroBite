import { useState, useMemo, useCallback, useEffect } from "react";
import { useProductsQuery } from "../api/hooks/useProductsQuery";
import PageTitle from "../components/PageTitle";
import ErrorLabel from "../components/ErrorLabel";
import Button from "../components/Button";
import { Product } from "../api/types/Product";
import { useAccountsQuery } from "../api/hooks/useAccountsQuery";
import AccountOrders from "../admin/orders/AccountOrders";
import AccountsOrdersSkeleton from "../admin/orders/AccountOrdersSkeleton";
import SearchBar from "../components/SearchBar";
import { Account } from "../api/types/Account";

export default function AdminUserOrdersPage() {
  const accountsQuery = useAccountsQuery();
  const productsQuery = useProductsQuery();
  const [expandedAccountId, setExpandedAccountId] = useState<string | null>(null);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);

  const productsMap = useMemo(() => {
    if (!productsQuery.data) {
      return new Map<number, Product>();
    }
    return new Map(productsQuery.data.map((p) => [p.id, p]));
  }, [productsQuery.data]);

  const handleAccountClick = async (accountId: string) => {
    if (expandedAccountId === accountId) {
      setExpandedAccountId(null);
      return;
    }
    setExpandedAccountId(accountId);
  };

  const handleFilterChange = useCallback(
    (text: string) => {
      if (!accountsQuery.data) {
        setFilteredAccounts([]);
        return;
      }
      if (text === "") {
        setFilteredAccounts(accountsQuery.data);
        return;
      }
      setFilteredAccounts(
        accountsQuery.data.filter((account) =>
          account.email.toLowerCase().includes(text.toLowerCase())
        )
      );
    },
    [accountsQuery.data]
  );

  useEffect(() => {
    handleFilterChange("");
  }, [accountsQuery.data, handleFilterChange]);

  if (accountsQuery.isLoading || productsQuery.isLoading) {
    return <AccountsOrdersSkeleton />;
  }

  return (
    <div className="flex flex-col p-6 max-w-6xl mx-auto">
      <PageTitle text="Account Orders" />

      <ErrorLabel error={accountsQuery.error?.message || ""} />

      <SearchBar onTextChange={handleFilterChange} />

      {filteredAccounts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No accounts found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredAccounts.map((account) => (
            <div key={account.id} className="cursor-pointer hover:text-blue-500">
              <Button
                text={`${account.firstName} ${account.lastName} (${account.email})`}
                className="font-bold"
                onClick={() => handleAccountClick(account.id)}
              />
              {expandedAccountId === account.id && (
                <AccountOrders account={account} productsMap={productsMap} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
