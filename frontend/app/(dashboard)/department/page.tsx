"use client";

import AddButton from "@/components/UI/AddButton";
import Modal from "@/components/UI/Modal";
import EditDeleteIcon from "@/components/UI/TableCompoents/EditDeleteIcon";
import Table from "@/components/UI/TableCompoents/Table";
import { Organization } from "@/types/organization.types";
import { formatDate } from "@/helper/date";
import { useTableQueryParams } from "@/hooks/useTablequeryParams";
import { useDebounce } from "@/hooks/useDebounce";
import React from "react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOrganization,
  deleteOrganization,
  getOrganizations,
  updateOrganization,
} from "@/service/API/orgnization.api";
import toast from "react-hot-toast";
import { Building } from "lucide-react";
import DepartmentForm from "@/components/FormUI/DepartmentForm";
import { FaPeopleGroup } from "react-icons/fa6";
import ConfirmAlert from "@/components/UI/ConfirmAlert";

const DepartmentPage = () => {
  const { page, limit, search, setPage, setLimit, setSearch } =
    useTableQueryParams();

  const debouncedSearch = useDebounce(search, 500);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);


  const queryClient = useQueryClient();

  //  React Query magic
  const { data, isLoading, error } = useQuery({
    queryKey: ["organizations", page, limit, debouncedSearch],
    queryFn: () => getOrganizations({ page, limit, search: debouncedSearch }),

    // v5 replacement for keepPreviousData
    staleTime: 1000 * 30, // 30s cache
    retry: false,
  });

  React.useEffect(() => {
    if (error) {
      toast.error(
        error.message || "Server error. Please check if server is running.",
      );
    }
  }, [error]);

  const organizations = data?.data ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  const columns = [
    { key: "no", label: "No." },
    { key: "department", label: "Department" },
    {
      key: "createdAt",
      label: "Created At",
      render: (row: Organization) => formatDate(row.createdAt),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: Organization) => (
        <EditDeleteIcon
          onEdit={() => {
            setEditingOrg(row);
            setIsModalOpen(true);
          }}

          onDelete={() => {
            setDeleteId(row.id);
            setIsAlertOpen(true);
          }}
        />
      ),
    },
  ];

  //create branch mutation
  const addMutation = useMutation({
    mutationFn: createOrganization,

    onSuccess: () => {
      toast.success("Organization added successfully");
      setIsModalOpen(false);

      queryClient.invalidateQueries({
        queryKey: ["organizations"], //  refetch list
      });
    },

    onError: (error: any) => {
      toast.error(error.message || "Failed to add organization");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      updateOrganization(id, data),

    onSuccess: () => {
      toast.success("Organization updated successfully");
      setIsModalOpen(false);
      setEditingOrg(null);

      queryClient.invalidateQueries({
        queryKey: ["organizations"],
      });
    },

    onError: (error: any) => {
      toast.error(error.message || "Update failed");
    },
  });


  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteOrganization(id),

    onSuccess: () => {
      toast.success("Organization deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["organizations"],
      });

      setIsAlertOpen(false);
      setDeleteId(null);

    },

    onError: (error: any) => {
      toast.error(error.message || "Delete failed");
    },

  })

  const handleSubmitOrganization = (formData: any) => {
    if (editingOrg) {
      updateMutation.mutate({
        id: editingOrg.id, // or id depending backend
        data: formData,
      });
    } else {
      addMutation.mutate(formData);
    }
  };

  const handleCancel = () => {
    if (!addMutation.isPending) {
      setIsModalOpen(false);
      setEditingOrg(null);
    }
  };

  const tableData = organizations.map((org: any, index: number) => ({
    ...org,
    no: (page - 1) * limit + index + 1,
  }));

  return (
    <div className="p-2">
      <div className="flex items-start justify-between">
        <h2 className="text-xl md:text-3xl font-semibold">Department</h2>

        <AddButton
          onClick={() => {
            setEditingOrg(null);
            setIsModalOpen(true);
          }}
          logo={<FaPeopleGroup size={30} />}
          btnHeading="Add Department"
        />
      </div>

      <Table
        title="Department"
        columns={columns}
        data={tableData}
        isLoading={isLoading}
        search={search}
        onSearchChange={setSearch}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        itemsPerPage={limit}
        onItemsPerPageChange={(v) => {
          setLimit(v);
          setPage(1);
        }}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCancel}
        title={editingOrg ? "Update Organization" : "Add Organization"}
        size="lg"
      >
        <DepartmentForm
        //   onSubmit={handleSubmitOrganization}
        //   onCancel={handleCancel}
        //   isSubmitting={addMutation.isPending || updateMutation.isPending}
        //   initialData={editingOrg ?? undefined}
        />
      </Modal>


      <ConfirmAlert
  isOpen={isAlertOpen}
  closeModal={() => setIsAlertOpen(false)}
  title="Delete Organization"
  message="This action cannot be undone. Do you want to delete?"
  confirmText="Delete"
  onConfirm={() => deleteMutation.mutate(deleteId!)}
  isLoading={deleteMutation.isPending}
/>



    </div>
  );
};

export default DepartmentPage;
