"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { signInWithGitHub, signInWithGoogle } from "@/actions/auth";
import { useState } from "react";
import { GithubIcon, GoogleIcon } from "../icons";

interface SignInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignInModal({ open, onOpenChange }: SignInModalProps) {
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isLoadingGitHub, setIsLoadingGitHub] = useState(false);
  const handleGitHub = async () => {
    setIsLoadingGitHub(true);
    await signInWithGitHub();
  };

  const handleGoogle = async () => {
    setIsLoadingGoogle(true);
    await signInWithGoogle();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Iniciar sesión</DialogTitle>
          <DialogDescription>
            Inicia sesión en tu cuenta para continuar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              GitHub
            </p>
            <Button
              onClick={handleGitHub}
              disabled={isLoadingGitHub || isLoadingGoogle}
              variant="outline"
              className="w-full h-11 rounded-lg border-2 hover:bg-muted bg-transparent cursor-pointer active:scale-95 transition-transform"
              aria-label="Sign in with GitHub"
            >
              {isLoadingGitHub ? (
                "Cargando..."
              ) : (
                <>
                  <GithubIcon className="size-5 mr-2" />
                  Continuar con GitHub
                </>
              )}
            </Button>
          </div>
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                O
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Google
            </p>
            <Button
              onClick={handleGoogle}
              variant="outline"
              disabled={isLoadingGoogle || isLoadingGitHub}
              className="w-full h-11 rounded-lg border-2 hover:bg-muted bg-transparent active:scale-95 transition-transform cursor-pointer"
              aria-label="Sign in with Google"
            >
              {isLoadingGoogle ? (
                "Cargando..."
              ) : (
                <>
                  <GoogleIcon className="size-5 mr-2" />
                  Continuar con Google
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
