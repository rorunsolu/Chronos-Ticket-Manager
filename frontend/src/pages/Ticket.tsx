import { UserAuth } from "@/context/AuthContext";
import { type Ticket, type TicketComment } from "@/common/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

// export type updationPayload = {
//   title?: string;
//   description?: string;
//   priority?: string;
//   status?: string;
// };

const Ticket = () => {
  const queryClient = useQueryClient();

  const { session } = UserAuth();
  const { id } = useParams<Pick<Ticket, "id">>();

  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("open");

  // Ability to add comments based on roles/owner/creator
  // Clicking on comment author should navigate to their profile

  const fetchTicketInfo = async () => {
    const response = await fetch(`/api/tickets/${id}`, {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch ticket info");
    }

    return response.json();
  };

  const createTicketComment = async () => {
    const response = await fetch(`/api/tickets/${id}/comments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create ticket comment");
    }
  };

  const fetchTicketComments = async () => {
    const response = await fetch(`/api/tickets/${id}/comments`, {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch ticket info");
    }

    return response.json();
  };

  const fetchTicketHistory = async () => {
    const response = await fetch(`/api/tickets/${id}/history`, {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch ticket info");
    }

    return response.json();
  };

  const updateTicketInfo = async () => {
    const updationPayload: Record<string, any> = {};

    if (title !== ticketInfo.title) updationPayload.title = title;
    if (description !== ticketInfo.description)
      updationPayload.description = description;
    if (priority !== ticketInfo.priority) updationPayload.priority = priority;
    if (status !== ticketInfo.status) updationPayload.status = status;
    if (Object.keys(updationPayload).length === 0)
      return { updationPayload: null };

    const response = await fetch(`/api/tickets/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updationPayload),
    });

    if (!response.ok) {
      throw new Error("Failed to update ticket info");
    }

    const json = await response.json();
    return { json, updationPayload };
  };

  const createHistory = async (payload: {
    // handling the mutation process inside the other mutations after they themselves succeed might remove the need for this function?
    //actorId: string;
    // actorName: string; service file sources this data itself
    //actorPermLevel: string; controller file sources this data itself
    actionType:
      | "created"
      | "updated"
      | "assigned"
      | "unassigned"
      | "status_changed"
      | "priority_changed"
      | "commented"
      | "closed"
      | "reopened";
    changedFields?: Record<string, unknown> | null;
  }) => {
    const response = await fetch(`/api/tickets/${id}/history`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error("Failed to create ticket history");
    }

    return response.json();
  };

  // Flow

  // 1. User triggers a mutation
  // 1.a Comment is made
  // 1.b Ticket is updated

  // 2. Mutation runs a function
  // 2.a commentMutation runs createTicketComment
  // 2.b ticketUpdateMutation runs updateTicketInfo

  // 3. Said functions sends/gets data to/from backend
  // 3.a createTicketComment sends comment to backend
  // 3.b updateTicketInfo sends updates to backend

  // 4. If successful, mutation can trigger and optional action
  // 4.a commentMutation clears message/comment local state/field
  // 4.b ticketUpdateMutation invalidates queries

  const ticketUpdateMutation = useMutation({
    mutationFn: updateTicketInfo,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["ticketInfo", id] });
      if (data?.updationPayload) {
        // this stage needs to be repeated in other mutation no?
        historyMutation.mutate({
          //actorId: session?.user?.sub ?? session?.user?.id ?? "",
          actionType: "updated", // needs to change depending on the action
          changedFields: data.updationPayload,
        });
      }
    },
  });

  const historyMutation = useMutation({
    mutationFn: createHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ticketHistory", id],
      });
    },
  });

  const commentMutation = useMutation({
    mutationFn: createTicketComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ticketComments", id],
      });
      historyMutation.mutate({
        actionType: "commented",
      });
      setMessage("");
    },
  });

  const {
    data: ticketHistory,
    isLoading: historyLoading,
    error: historyError,
  } = useQuery({
    queryKey: ["ticketHistory", id],
    queryFn: fetchTicketHistory,
    enabled: !!session?.access_token && !!id,
  });

  const {
    data: ticketInfo,
    isLoading: ticketLoading,
    error: ticketError,
  } = useQuery({
    queryKey: ["ticketInfo", id],
    queryFn: fetchTicketInfo,
    enabled: !!session?.access_token && !!id,
  });

  const {
    data: comments,
    isLoading: commentsLoading,
    error: commentsError,
  } = useQuery({
    queryKey: ["ticketComments", id],
    queryFn: fetchTicketComments,
    enabled: !!session?.access_token && !!id,
  });

  useEffect(() => {
    if (ticketInfo) {
      setTitle(ticketInfo.title);
      setDescription(ticketInfo.description);
      setPriority(ticketInfo.priority);
      setStatus(ticketInfo.status);
    }
    if (ticketHistory) {
      setHistory(ticketHistory);
    }
  }, [ticketInfo, ticketHistory]);

  if (ticketLoading || commentsLoading) return <p>Loading...</p>;
  if (ticketError) return <p>Error: {ticketError.message}</p>;
  if (historyLoading) return <p>Loading ticket history...</p>;

  const isUnchanged =
    // FIXME: THIS ISNT HAVING ANY AFFECT
    title === ticketInfo.title &&
    description === ticketInfo.description &&
    priority === ticketInfo.priority &&
    status === ticketInfo.status;

  return (
    <div>
      <div className="flex flex-col gap-2">TICKET PAGE</div>
      <div>
        <h3>Ticket Details</h3>
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            ticketUpdateMutation.mutate();
          }}
        >
          <input
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className="bg-gray-800"
          />

          <input
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="bg-gray-800"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="bg-gray-800"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-gray-800"
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={isUnchanged || ticketUpdateMutation.isPending}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {ticketUpdateMutation.isPending ? "Updating..." : "Update ticket"}
            </button>
          </div>
        </form>
      </div>
      <div className="flex flex-col gap-2 ">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-fit">
          Resolve Ticket
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-fit">
          Close Ticket
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-fit">
          Delete Ticket
        </button>
      </div>
      <div className="flex flex-col bg-blue-500 hover:bg-blue-700 text-white mt-3">
        {commentsError && (
          <div className="flex flex-col gap-2">
            <p>Error loading comments</p>
          </div>
        )}
        {comments?.length === 0 ? (
          <p>No comments yet</p>
        ) : (
          <div className="flex flex-col gap-2">
            {comments?.length === 0 ? (
              <p>No comments yet</p>
            ) : (
              (comments ?? []).map((comment: TicketComment) => (
                <article
                  key={comment.id}
                  className="flex flex-col gap-2 bg-amber-600 "
                >
                  <p>{comment.message}</p>
                  <p>{comment.created_at}</p>
                </article>
              ))
            )}
          </div>
        )}
        <div className="flex flex-col">
          <form
            className="flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              commentMutation.mutate();
            }}
          >
            <input
              type="text"
              placeholder="Comment"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-fit"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      <div className="flex flex-col bg-blue-500 hover:bg-blue-700 text-white mt-3">
        <h4>History</h4>
        <div className="flex flex-col gap-2">
          {historyError && (
            <div className="flex flex-col gap-2">
              <p>Error loading history</p>
            </div>
          )}

          {history?.length === 0 ? (
            <p>No history yet</p>
          ) : (
            <div className="flex flex-col gap-2">
              {history?.length === 0 ? (
                <p>No history yet</p>
              ) : (
                (history ?? []).map((comment: TicketComment) => (
                  <article
                    key={comment.id}
                    className="flex flex-col gap-2 bg-amber-600 "
                  >
                    <p>{comment.message}</p>
                    <p>{comment.created_at}</p>
                  </article>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ticket;
