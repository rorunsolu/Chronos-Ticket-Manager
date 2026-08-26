import { UserAuth } from "@/context/AuthContext";
import { type Ticket, type TicketComment } from "@/common/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useState } from "react";

const Ticket = () => {
  const { session } = UserAuth();
  const { id } = useParams<Pick<Ticket, "id">>();
  const [message, setMessage] = useState("");

  const queryClient = useQueryClient();

  // Display ticket details
  // Limit edit access based on roles/owner/creator
  // Display ticket comments
  // Ability to add comments based on roles/owner/creator
  // Clicking on comment author should navigate to their profile
  // Pass the id in url as param for the get request to the DB

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

  const mutation = useMutation({
    mutationFn: createTicketComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ticketComments", id],
      });
      setMessage("");
    },
  });

  const {
    data: ticketInfo,
    isLoading: ticketLoading,
    error: ticketError,
  } = useQuery({
    queryKey: ["ticketInfo"],
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

  if (!session) return <div>Please sign in</div>;
  if (ticketLoading || commentsLoading) return <p>Loading...</p>;
  if (ticketError) return <p>Error: {ticketError.message}</p>;
  if (commentsError) return <p>Error loading comments</p>;

  return (
    <div>
      <div className="flex flex-col gap-2">TICKET PAGE</div>
      <div>
        <h3>Ticket Details</h3>
        <article className="flex flex-col gap-2  bg-amber-400">
          <p>{ticketInfo.title}</p>
          <p>{ticketInfo.description}</p>
          <p>{ticketInfo.priority}</p>
        </article>
      </div>
      <div>
        <h4>Ticket Comments</h4>
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
      </div>
      <div className="flex flex-col">
        <h4>Add Comment</h4>
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
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
  );
};

export default Ticket;
