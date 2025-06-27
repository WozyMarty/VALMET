// src/components/GlobalErrorModal.tsx (Versão Corrigida)
import React from 'react';
import { useError } from '@/contexts/ErrorContext';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AlertTriangle } from 'lucide-react';
import '../contexts/custom-alert-dialog.css'; // Importe seu CSS aqui

export const GlobalErrorModal: React.FC = () => {
  const { isErrorModalOpen, closeErrorModal, errorMessage, errorTitle } = useError();

  if (!isErrorModalOpen) {
    return null;
  }

  return (
    <AlertDialog open={isErrorModalOpen} onOpenChange={closeErrorModal}>
      <AlertDialogContent className="meu-alert-dialog-content">
        <AlertDialogHeader>
          <AlertDialogTitle className="meu-alert-dialog-title">
            <AlertTriangle aria-hidden="true" />
            {errorTitle}
          </AlertDialogTitle>
          <AlertDialogDescription className="meu-alert-dialog-description">
            {errorMessage}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={closeErrorModal} className="meu-alert-dialog-action-ok">
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};