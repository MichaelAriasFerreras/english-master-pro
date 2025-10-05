
import TranslationAdminClient from './translation-admin-client';

export default function TranslationAdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Administrador de Traducciones
          </h1>
          <p className="text-gray-600">
            Monitor y gestión del sistema de corrección masiva de traducciones de verbos
          </p>
        </div>
        
        <TranslationAdminClient />
      </div>
    </div>
  );
}
