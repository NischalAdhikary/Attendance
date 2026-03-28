import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useState } from "react";
import { useClasses } from "../../../hooks/classes/useClass";
import EditClassForm from "./editClass";
import EditSectionForm from "./editSection";
import DeleteClassModal from "./deleteClassModal";
import DeleteSectionModal from "./deleteSectionModal"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../../components/ui/dropdown-menu";

export default function ClassTable({ setValue, value }) {
  const [classModal, setClassModal] = useState(false);
  const [sectionModal, setSectionModal] = useState(false);
  const [deleteClassModal, setDeleteClassModal] = useState(false);
  const [deleteSectionModal, setDeleteSectionModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const {
    data: classes = [],
    isLoading,
    isError,
  } = useClasses();

  const classData = classes?.data || [];

  if (isLoading) {
    return <p>Loading classes...</p>;
  }

  if (isError) {
    return <p>Failed to load classes</p>;
  }

  const handleEditClass = (c) => {
    setValue({
      id: c.id,
      class_id: c.class_id,
      class: c.class_name,
      section: c.section_name,
    });
    setClassModal(true);
  };

  const handleEditSection = (c) => {
    setValue({
      id: c.id,
      class_id: c.class_id,
      class: c.class_name,
      section: c.section_name,
    });
    setSectionModal(true);
  };

  const openDeleteClassModal = (c) => {
    setDeleteItem(c);
    setDeleteClassModal(true);
  };

  const openDeleteSectionModal = (c) => {
    setDeleteItem(c);
    setDeleteSectionModal(true);
  };

  const handleSaveClass = (data) => {
    console.log("save class", data);
    setClassModal(false);
    resetForm();
  };

  const handleSaveSection = (data) => {
    console.log("save section", data);
    setSectionModal(false);
    resetForm();
  };

  const handleDeleteClass = (item) => {
    console.log("delete class", item.class_id);
    setDeleteClassModal(false);
    setDeleteItem(null);
  };

  const handleDeleteSection = (item) => {
    console.log("delete section", item.id);
    setDeleteSectionModal(false);
    setDeleteItem(null);
  };

  const resetForm = () => {
    setValue({
      id: "",
      class_id: "",
      class: "",
      section: "",
    });
  };

  return (
    <>
      <Table>
        <TableCaption>List of Classes</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Class</TableHead>
            <TableHead>Section</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {classData.length > 0 ? (
            classData.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.class_name}</TableCell>
                <TableCell>{c.section_name}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => handleEditClass(c)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Class
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => handleEditSection(c)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Section
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => openDeleteClassModal(c)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Class
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => openDeleteSectionModal(c)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Section
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No classes found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {classModal && (
        <EditClassForm
          editingClass={value}
          setEditingClass={setValue}
          handleSaveClass={handleSaveClass}
          onClose={() => {
            setClassModal(false);
            resetForm();
          }}
        />
      )}

      {sectionModal && (
        <EditSectionForm
          editingClass={value}
          setEditingClass={setValue}
          handleSaveSection={handleSaveSection}
          onClose={() => {
            setSectionModal(false);
            resetForm();
          }}
        />
      )}

      {deleteClassModal && deleteItem && (
        <DeleteClassModal
          deleteItem={deleteItem}
          handleDeleteClass={handleDeleteClass}
          onClose={() => {
            setDeleteClassModal(false);
            setDeleteItem(null);
          }}
        />
      )}

      {deleteSectionModal && deleteItem && (
        <DeleteSectionModal
          deleteItem={deleteItem}
          handleDeleteSection={handleDeleteSection}
          onClose={() => {
            setDeleteSectionModal(false);
            setDeleteItem(null);
          }}
        />
      )}
    </>
  );
}