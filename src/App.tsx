import React, { useState } from 'react';
import { Plus, Minus, Search } from 'lucide-react';

interface Parameter {
  name: string;
  selector: string;
}

interface ScrapingConfig {
  url: string;
  articleSelector: string;
  parameters: Parameter[];
}

interface BackendRequest {
  url: string;
  selector: string;
  nameSelector: { [key: string]: string }[];
}

function App() {
  const [config, setConfig] = useState<ScrapingConfig>({
    url: '',
    articleSelector: '',
    parameters: [{ name: '', selector: '' }]
  });
  const [isLoading, setIsLoading] = useState(false);

  const addParameter = () => {
    setConfig(prev => ({
      ...prev,
      parameters: [...prev.parameters, { name: '', selector: '' }]
    }));
  };

  const removeParameter = (index: number) => {
    setConfig(prev => ({
      ...prev,
      parameters: prev.parameters.filter((_, i) => i !== index)
    }));
  };

  const updateParameter = (index: number, field: keyof Parameter, value: string) => {
    setConfig(prev => ({
      ...prev,
      parameters: prev.parameters.map((param, i) => 
        i === index ? { ...param, [field]: value } : param
      )
    }));
  };

  const transformToBackendFormat = (config: ScrapingConfig): BackendRequest => {
    return {
      url: config.url,
      selector: config.articleSelector,
      nameSelector: config.parameters.map(param => ({
        [param.name]: param.selector
      }))
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const backendData = transformToBackendFormat(config);
      console.log('Enviando al backend:', backendData);

      const response = await fetch('http://localhost:3000/scrap/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData)
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await response.json();
      console.log('Respuesta del servidor:', data);
    } catch (error) {
      console.error('Error al realizar el scraping:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Search className="w-8 h-8 text-indigo-600" />
            Configuración de Web Scraping
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                  URL Objetivo
                </label>
                <input
                  type="url"
                  id="url"
                  value={config.url}
                  onChange={(e) => setConfig(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://ejemplo.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="articleSelector" className="block text-sm font-medium text-gray-700 mb-1">
                  Selector de Artículo/Producto
                </label>
                <input
                  type="text"
                  id="articleSelector"
                  value={config.articleSelector}
                  onChange={(e) => setConfig(prev => ({ ...prev, articleSelector: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder=".product-cell--actionable"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  El selector CSS que identifica cada producto/artículo en la página
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Campos de Datos a Extraer</h2>
                  <p className="text-sm text-gray-500">Añade los campos que deseas extraer de cada producto</p>
                </div>
                <button
                  type="button"
                  onClick={addParameter}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Añadir Campo
                </button>
              </div>

              {config.parameters.map((param, index) => (
                <div key={index} className="flex gap-4 items-start bg-gray-50 p-4 rounded-lg">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={param.name}
                      onChange={(e) => updateParameter(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-2"
                      placeholder="Nombre del campo (ej: precio, título)"
                      required
                    />
                    <input
                      type="text"
                      value={param.selector}
                      onChange={(e) => updateParameter(index, 'selector', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Selector CSS (ej: .product-price)"
                      required
                    />
                  </div>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeParameter(index)}
                      className="p-1.5 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Extrayendo datos...' : 'Iniciar Extracción'}
            </button>
          </form>
        </div>

        {isLoading && (
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Resultados de la Extracción</h2>
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;