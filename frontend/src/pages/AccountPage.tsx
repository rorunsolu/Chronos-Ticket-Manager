import { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { User } from "@supabase/supabase-js";

type ProfileData = {
  name: string;
  email: string;
  role: string;
};

const AccountPage = ({ user }: { user: User }) => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: user.email ?? "",
    role: "",
  });

  useEffect(() => {
    let ignore = false;

    async function getProfile() {
      setLoading(true);

      const { data, error } = await supabase
        .from("users")
        .select("email, name, role")
        .eq("id", user.id)
        .single();

      if (!ignore) {
        if (error) {
          console.warn(error);
        } else if (data) {
          setProfile({
            name: data.name ?? "",
            email: data.email ?? user.email ?? "",
            role: data.role ?? "",
          });
        }
      }

      setLoading(false);
    }

    void getProfile();

    return () => {
      ignore = true;
    };
  }, [user.id, user.email]);

  async function updateProfile(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const updates = {
      id: user.id,
      name: profile.name,
      updated_at: new Date(),
    };

    const { error } = await supabase.from("users").upsert(updates);

    if (error) {
      alert(error.message);
    }

    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center p-10">
      <form onSubmit={updateProfile}>
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
                    placeholder="Emma"
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, name: e.target.value }))
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
                    value={profile.email}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, email: e.target.value }))
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
                    placeholder="Senior Manager"
                    type="text"
                    value={profile.role}
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
            disabled={loading}
          >
            Go back
          </Button>
          <Button
            className="whitespace-nowrap"
            type="submit"
            disabled={loading}
          >
            Save settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AccountPage;
