"use client";

import AddButton from "@/components/UI/AddButton";
import Modal from "@/components/UI/Modal";
import EditDeleteIcon from "@/components/UI/TableCompoents/EditDeleteIcon";
import Table from "@/components/UI/TableCompoents/Table";
import { formatDate } from "@/helper/date";
import { useTableQueryParams } from "@/hooks/useTablequeryParams";
import { useDebounce } from "@/hooks/useDebounce";
import React, { useEffect } from "react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import DepartmentForm from "@/components/FormUI/DepartmentForm";
import { FaPeopleGroup } from "react-icons/fa6";
import ConfirmAlert from "@/components/UI/ConfirmAlert";
import BranchSelectWrapper from "@/components/wrapper/BranchSelectWrapper";
import { createPosition, deletePosition, getPositions, updatePosition } from "@/service/API/position.api";
import { Position, PositionFormValues } from "@/types/position.types";
import PositionForm from "@/components/FormUI/PositionForm";

const PositionPage = () => {
  const { page, limit, search, setPage, setLimit, setSearch } =
    useTableQueryParams();

  const debouncedSearch = useDebounce(search, 600);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPos, setEditingPos] = useState<Position | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [branchId, setBranchId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  //  React Query magic
  const { data, isLoading, error } = useQuery({
    queryKey: ["positions", page, limit, debouncedSearch, branchId],
    queryFn: () =>
      getPositions({
        page,
        limit,
        search: debouncedSearch,
        ...(typeof branchId === "number" && { branchId }), //only add if exist
      }),

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

  const positions = data?.data ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  const columns = [
    { key: "no", label: "No." },
    { key : "pos_name", label: "Position" },
    {
  key: "department",
  label: "Department",
  render: (row: Position) => row.department?.dept_name || "-",
},
    {
      key: "createdAt",
      label: "Created At",
      render: (row: any) => formatDate(row.createdAt),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: Position) => (
        <EditDeleteIcon
          onEdit={() => {
            setEditingPos(row);
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

  const memoInitialData = React.useMemo(() => {
    if (!editingPos) return undefined;

    return {
      branchId: editingPos.branch?.id ?? undefined,
    departmentId: editingPos.department?.id ?? undefined,
    positions: [editingPos.pos_name],
    };
  }, [editingPos]);

  //create branch mutation
  const addMutation = useMutation({
    mutationFn: createPosition,

    onSuccess: () => {
      toast.success("Position added successfully");
      setIsModalOpen(false);

      queryClient.invalidateQueries({
        queryKey: ["positions"], //  refetch list
      });
    },

    onError: (error: any) => {
      toast.error(error.message || "Failed to add position");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      updatePosition(id, data),

    onSuccess: () => {
      toast.success("Position updated successfully");
      setIsModalOpen(false);
      setEditingPos(null);

      queryClient.invalidateQueries({
        queryKey: ["positions"],
      });
    },

    onError: (error: any) => {
      toast.error(error.message || "Update failed");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deletePosition(id),

    onSuccess: () => {
      toast.success("Position deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["positions"],
      });

      setIsAlertOpen(false);
      setDeleteId(null);
    },

    onError: (error: any) => {
      toast.error(error.message || "Delete failed");
    },
  });

  const handleSubmitPosition = (formData: PositionFormValues) => {
    if (editingPos) {
      const payload = {
        pos_name: formData.positions?.[0] || "", //  convert array → string
        branchId: formData.branchId,
        departmentId: formData.departmentId
      };

      updateMutation.mutate({
        id: editingPos.id, // or id depending backend
        data: payload,
      });
    } else {
      addMutation.mutate(formData);
    }
  };

  const handleCancel = () => {
    if (!addMutation.isPending) {
      // setEditingPos(null);
      setIsModalOpen(false);
    }
  };

  const tableData = positions.map((org: any, index: number) => ({
    ...org,
    no: (page - 1) * limit + index + 1,
  }));

  return (
    <div className="p-2">
      <div className="flex items-start justify-between">
        <h2 className="text-xl md:text-3xl font-semibold">Position</h2>

        <AddButton
          onClick={() => {
            setEditingPos(null);
            setIsModalOpen(true);
          }}
          logo={<FaPeopleGroup size={30} />}
          btnHeading="Add Position"
        />
      </div>

      <Table
        branchDropdown={
          <BranchSelectWrapper
            value={branchId}
            onChange={setBranchId}
            multiple={false}
          />
        }
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
        }}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCancel}
        title={editingPos ? "Update Position" : "Add Position"}
        size="lg"
      >
        <PositionForm
          key={editingPos ? "edit" : "create"}
          isOpen={isModalOpen}
          isEdit={!!editingPos}
          onSubmit={handleSubmitPosition}
          onCancel={handleCancel}
          isSubmitting={addMutation.isPending || updateMutation.isPending}
          initialData={memoInitialData}
        />
      </Modal>

      <ConfirmAlert
        isOpen={isAlertOpen}
        closeModal={() => setIsAlertOpen(false)}
        title="Delete Position"
        message="This action cannot be undone. Do you want to delete?"
        confirmText="Delete"
        onConfirm={() => deleteMutation.mutate(deleteId!)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default PositionPage;

