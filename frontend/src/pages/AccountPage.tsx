import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { Session } from "@supabase/supabase-js";
import {
  //useEffect,
  useState,
} from "react";

type ProfileData = {
  name: string;
  email: string;
  role: string;
};

const AccountPage = ({ session }: { session: Session }) => {
  // cant call the variable "profile" because RQ already uses profile to represent the data returned from it's query
  const [formData, setFormData] = useState<ProfileData>({
    name: "",
    email: "",
    role: "",
  });

  const queryClient = useQueryClient();

  // 1. React Query gets the data from DB
  // 2. Use RQ data variable to display data in form fields
  // 3. Typing into form field changes the formData state variable
  // 4. Submtting form calls RQ mutate to use updateProfile function
  // 5. updateProfile function makes a request to backend to update the DB with the formData

  const getProfile = async () => {
    const response = await fetch("/api/profile", {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    return await response.json();
  };

  const updateProfile = async (data: ProfileData) => {
    // the data parameter is the formData state variable
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        //! NEED TO DEAL WITH THE ABOVE
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response.json();
  };

  // https://tanstack.com/query/latest/docs/framework/react/guides/mutations
  // https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      setFormData({
        name: profile?.name,
        email: profile?.email,
        role: profile?.role,
      });
      console.log("Profile updated successfully");
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
    },
  });

  const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  // useEffect(() => {
  //   if (profile) {
  //     setFormData({
  //       name: profile.name ?? "",
  //       email: profile.email ?? "",
  //       role: profile.role ?? "",
  //     });
  //   }
  // }, [profile]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading profile</p>;
  }

  if (!profile) {
    return <p>Profile data could not be loaded.</p>;
  }

  return (
    <div className="flex items-center justify-center p-10">
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <h2 className="text-balance font-semibold text-foreground dark:text-foreground">
              Personal information
            </h2>
            <p className="mt-1 text-pretty text-muted-foreground text-sm leading-6 dark:text-muted-foreground">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr.
            </p>
          </div>

          <div className="sm:max-w-3xl md:col-span-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
              <div className="col-span-full sm:col-span-3">
                <Field className="gap-2">
                  <FieldLabel htmlFor="first-name">First name</FieldLabel>
                  <Input
                    autoComplete="given-name"
                    id="first-name"
                    name="first-name"
                    placeholder="First name"
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </Field>
              </div>

              <div className="col-span-full">
                <Field className="gap-2">
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    autoComplete="email"
                    id="email"
                    name="email"
                    placeholder="emma@company.com"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </Field>
              </div>

              <div className="col-span-full sm:col-span-3">
                <Field className="gap-2">
                  <FieldLabel htmlFor="role">Role</FieldLabel>
                  <Input
                    disabled
                    id="role"
                    name="role"
                    //placeholder="Senior Manager"
                    type="text"
                    value={formData.role}
                  />
                  <FieldDescription>
                    Roles can only be changed by system admin.
                  </FieldDescription>
                </Field>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex items-center justify-end space-x-4">
          <Button
            className="whitespace-nowrap"
            type="button"
            variant="outline"
            //disabled={mutation.isLoading}
          >
            Go back
          </Button>
          <Button
            className="whitespace-nowrap"
            type="submit"
            //disabled={loading}
          >
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AccountPage;
