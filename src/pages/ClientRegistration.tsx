import { useState } from 'react';
import ClientRegistrationForm from '@/components/ClientRegistrationForm';
import { Client } from '@/types/restaurant';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export default function ClientRegistration() {
  const navigate = useNavigate();

  const handleSaveClient = (client: Client) => {
    // In a real app, this would save to backend
    console.log('Novo cliente cadastrado:', client);
    
    toast({
      title: "Cliente cadastrado com sucesso!",
      description: `Cliente ${client.clientNumber} foi adicionado ao sistema.`,
    });
    
    navigate('/clients');
  };

  const handleCancel = () => {
    navigate('/clients');
  };

  return (
    <ClientRegistrationForm 
      onSave={handleSaveClient}
      onCancel={handleCancel}
    />
  );
}