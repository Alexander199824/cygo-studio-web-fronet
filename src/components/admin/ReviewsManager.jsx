import React, { useState, useEffect } from 'react';
import { reviewApi } from '../../utils/apiService';
import { MessageSquare, CheckCircle, XCircle } from 'lucide-react';

const ReviewsManager = ({ onError }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        
        // Preparar parámetros de filtro
        const params = {};
        
        if (filter !== 'all') {
          params.approved = filter === 'approved';
        }
        
        const data = await reviewApi.getAll(params);
        setReviews(data.reviews);
      } catch (err) {
        console.error('Error al cargar reseñas:', err);
        onError('Error al cargar reseñas');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [onError, filter]);

  const handleToggleApproval = async (id) => {
    try {
      setLoading(true);
      await reviewApi.toggleApproval(id);
      
      // Actualizar estado local
      setReviews(reviews.map(review => 
        review.id === id ? { ...review, approved: !review.approved } : review
      ));
    } catch (err) {
      console.error('Error al cambiar estado de reseña:', err);
      onError('Error al cambiar estado de reseña');
    } finally {
      setLoading(false);
    }
  };

  // Renderizar estrellas de calificación
  const renderStars = (rating) => {
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i} 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading && reviews.length === 0) {
    return <div className="text-center py-10">Cargando reseñas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gestión de Reseñas del Establecimiento</h2>
        <div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
          >
            <option value="all">Todas las reseñas</option>
            <option value="approved">Aprobadas</option>
            <option value="pending">Pendientes de aprobación</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map(review => (
          <div 
            key={review.id} 
            className={`bg-white rounded-lg overflow-hidden border ${
              review.approved ? 'border-green-200' : 'border-yellow-200'
            }`}
          >
            <div className={`p-4 ${
              review.approved ? 'bg-green-50' : 'bg-yellow-50'
            }`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img 
                      className="h-10 w-10 rounded-full" 
                      src={review.client.profileImage || '/images/placeholder.jpg'} 
                      alt="" 
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{review.client.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  {renderStars(review.rating)}
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-700">{review.review}</p>
              
              <div className="mt-4 flex justify-between items-center">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  review.approved 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {review.approved ? 'Aprobada' : 'Pendiente'}
                </span>
                
                <button
                  onClick={() => handleToggleApproval(review.id)}
                  className={`inline-flex items-center px-3 py-1 rounded text-sm ${
                    review.approved
                      ? 'bg-red-50 text-red-700 hover:bg-red-100'
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                >
                  {review.approved ? (
                    <>
                      <XCircle size={16} className="mr-1" />
                      <span>Desaprobar</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} className="mr-1" />
                      <span>Aprobar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {reviews.length === 0 && (
          <div className="md:col-span-2 text-center py-16 bg-white rounded-lg border border-gray-200">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay reseñas</h3>
            <p className="mt-1 text-sm text-gray-500">
              Las reseñas de los clientes aparecerán aquí cuando estén disponibles.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsManager;