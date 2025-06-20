
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, Eye, Save, AlertCircle, CheckCircle, Home } from 'lucide-react';
import Link from 'next/link';

interface Event {
  date: string;
  original_date?: string;
  day_of_week: string;
  venue: string;
  event_name: string;
  type: string;
  tickets_url?: string;
  city: string;
  state: string;
  country: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewEvents, setPreviewEvents] = useState<Event[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check (in production, use proper authentication)
    if (password === 'nmreggae2025') {
      setIsAuthenticated(true);
      setMessage(null);
    } else {
      setMessage({ type: 'error', text: 'Invalid password' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setMessage(null);
    } else {
      setMessage({ type: 'error', text: 'Please select a valid CSV file' });
      setFile(null);
    }
  };

  const handlePreview = async () => {
    if (!file) return;

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('password', password);
      formData.append('preview', 'true');

      const response = await fetch('/api/admin/csv-upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to preview CSV');
      }

      setPreviewEvents(data.events);
      setMessage({ 
        type: 'success', 
        text: `Preview loaded: ${data.count} events found` 
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to preview CSV' 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('password', password);
      formData.append('preview', 'false');

      const response = await fetch('/api/admin/csv-upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload CSV');
      }

      setMessage({ 
        type: 'success', 
        text: data.message || `Successfully uploaded ${data.count} events` 
      });
      setFile(null);
      setPreviewEvents([]);
      
      // Reset file input
      const fileInput = document.getElementById('csv-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to upload CSV' 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleBackup = async () => {
    try {
      const response = await fetch(`/api/admin/backup?password=${encodeURIComponent(password)}`);
      
      if (!response.ok) {
        throw new Error('Failed to create backup');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reggae-events-backup-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setMessage({ type: 'success', text: 'Backup downloaded successfully' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to create backup' 
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
        <motion.div
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
            Admin Access
          </h1>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter admin password"
                required
              />
            </div>
            
            {message && (
              <div className={`p-3 rounded-lg ${
                message.type === 'error' ? 'bg-red-900/50 text-red-300' : 'bg-green-900/50 text-green-300'
              }`}>
                {message.text}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full px-4 py-2 bg-yellow-500 text-slate-900 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              href="/"
              className="text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              ← Back to Calendar
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-yellow-200">
            Manage New Mexico Reggae Calendar Events
          </p>
          
          <div className="mt-4">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-yellow-400 rounded-lg hover:bg-slate-600 transition-colors"
            >
              <Home className="w-4 h-4" />
              View Calendar
            </Link>
          </div>
        </motion.div>

        {/* Message Display */}
        {message && (
          <motion.div
            className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
              message.type === 'error' 
                ? 'bg-red-900/50 text-red-300' 
                : 'bg-green-900/50 text-green-300'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {message.type === 'error' ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
            {message.text}
          </motion.div>
        )}

        {/* File Upload Section */}
        <motion.div
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Events CSV
          </h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="csv-file" className="block text-sm font-medium text-gray-300 mb-2">
                Select CSV File
              </label>
              <input
                type="file"
                id="csv-file"
                accept=".csv"
                onChange={handleFileChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-500 file:text-slate-900 file:font-semibold hover:file:bg-yellow-400"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handlePreview}
                disabled={!file || uploading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Eye className="w-4 h-4" />
                {uploading ? 'Processing...' : 'Preview'}
              </button>
              
              <button
                onClick={handleUpload}
                disabled={!file || uploading || previewEvents.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {uploading ? 'Uploading...' : 'Upload & Save'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Backup Section */}
        <motion.div
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
            <Download className="w-5 h-5" />
            Backup Current Data
          </h2>
          
          <p className="text-gray-300 mb-4">
            Download current events as CSV backup before making changes.
          </p>
          
          <button
            onClick={handleBackup}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-slate-900 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Backup
          </button>
        </motion.div>

        {/* Preview Section */}
        {previewEvents.length > 0 && (
          <motion.div
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-bold text-yellow-400 mb-4">
              Preview: {previewEvents.length} Events
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left py-2 px-2 text-gray-300">Date</th>
                    <th className="text-left py-2 px-2 text-gray-300">Event</th>
                    <th className="text-left py-2 px-2 text-gray-300">Venue</th>
                    <th className="text-left py-2 px-2 text-gray-300">City</th>
                    <th className="text-left py-2 px-2 text-gray-300">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {previewEvents.slice(0, 10).map((event, index) => (
                    <tr key={index} className="border-b border-slate-700">
                      <td className="py-2 px-2 text-gray-300">{event.date}</td>
                      <td className="py-2 px-2 text-white">{event.event_name}</td>
                      <td className="py-2 px-2 text-gray-300">{event.venue}</td>
                      <td className="py-2 px-2 text-gray-300">{event.city}</td>
                      <td className="py-2 px-2 text-gray-300">{event.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {previewEvents.length > 10 && (
                <p className="text-gray-400 mt-2 text-center">
                  ... and {previewEvents.length - 10} more events
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Usage Instructions */}
        <motion.div
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-yellow-400 mb-4">
            CSV Format Instructions
          </h2>
          
          <div className="text-gray-300 space-y-2">
            <p>Your CSV file should include these columns (case-insensitive):</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>date</strong> - Event date (YYYY-MM-DD format)</li>
              <li><strong>event_name</strong> - Name of the event</li>
              <li><strong>venue</strong> - Venue name</li>
              <li><strong>city</strong> - City name</li>
              <li><strong>type</strong> - Event type (optional, defaults to "Live Show")</li>
              <li><strong>tickets_url</strong> - Ticket purchase URL (optional)</li>
              <li><strong>state</strong> - State (optional, defaults to "NM")</li>
              <li><strong>country</strong> - Country (optional, defaults to "USA")</li>
            </ul>
            <p className="mt-4 text-yellow-200">
              <strong>Note:</strong> Always create a backup before uploading new data. 
              The upload will replace all existing events.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
