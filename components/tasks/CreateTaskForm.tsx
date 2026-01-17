import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectValue } from "../ui/select";
import { SelectTrigger } from "@radix-ui/react-select";
import { Button } from "../ui/button";

const priorityOptions = ["low", "medium", "high"];

interface CreateTaskFormProps {
  onCreateTask: (event: React.FormEvent<HTMLFormElement>) => void;
}

const CreateTaskForm = ({ onCreateTask }: CreateTaskFormProps) => {
  return (
    <form className="space-y-4" onSubmit={onCreateTask}>
      <div className="space-y-2">
        <Label>Title *</Label>
        <Input
          id="title"
          name="title"
          placeholder="Enter task title"
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Enter task description"
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label>Assignee</Label>
        <Input id="assignee" name="assignee" placeholder="Who should do this" />
      </div>
      <div className="space-y-2">
        <Label>Priority</Label>
        <Select
          name="priority"
          defaultValue="medium"
          onValueChange={() => console.log("test")}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {priorityOptions.map((priority, index) => (
              <SelectItem key={index} value={priority}>
                {priority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Due Date</Label>
        <Input type="date" id="dueDate" name="dueDate" />
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit">Create Task</Button>
      </div>
    </form>
  );
};

export default CreateTaskForm;
