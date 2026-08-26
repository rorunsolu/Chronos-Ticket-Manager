import { UserAuth } from "@/context/AuthContext";
import { type Ticket } from "@/common/types";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Tickets = () => {
  const { session } = UserAuth();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  // MUST BE LEFT AS MED BY DEFAULT ACCORDING TO THE SCHEMA

  const createTicket = async () => {
    const response = await fetch("/api/tickets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        priority,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create ticket");
    }

    return response.json();
  };

  const mutation = useMutation({
    mutationFn: createTicket,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["tickets"],
      });
      setTitle("");
      setDescription("");
      setPriority("medium");
    },
  });

  const fetchTickets = async (): Promise<Ticket[]> => {
    const response = await fetch("/api/tickets", {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tickets");
    }

    return response.json();
  };

  const {
    data: tickets,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tickets"],
    queryFn: fetchTickets,
    enabled: !!session?.access_token,
  });

  if (!session) return <div>Please sign in</div>;
  if (isLoading) return <div>Loading tickets...</div>;
  if (error) return <div>Error loading tickets</div>;

  return (
    <div>
      <h1>Tickets</h1>

      {tickets?.length === 0 ? (
        <p>No tickets yet.</p>
      ) : (
        <ul>
          {tickets?.map((ticket) => (
            <li key={ticket.id}>
              <strong>{ticket.title}</strong> — {ticket.status} /{" "}
              {ticket.priority}
              <p>{ticket.description}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          className="flex flex-col"
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ticket title"
            className="bg-gray-800"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue"
            className="bg-gray-800"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {mutation.isPending ? "Creating..." : "Create ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Tickets;
