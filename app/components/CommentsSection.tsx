import React, { useState } from 'react';
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/textarea";
import { Send, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CommentsSection() {
  const [comment, setComment] = useState('');

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the comment to your backend
    console.log('Comment submitted:', comment);
    toast.success('Comment submitted successfully!');
    setComment('');
  };

  const handleReportBug = () => {
    // Here you would implement the bug reporting logic
    console.log('Reporting a bug');
    toast.success('Bug report submitted. Thank you for your feedback!');
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-white mb-4">Comments</h2>
      
      <form onSubmit={handleCommentSubmit} className="mb-6">
        <Textarea
          placeholder="Leave a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 mb-2 bg-gray-700 text-white border border-gray-600 rounded"
          rows={4}
        />
        <div className="flex justify-between">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Send className="w-4 h-4 mr-2" />
            Submit Comment
          </Button>
          <Button onClick={handleReportBug} className="bg-red-600 hover:bg-red-700 text-white">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Report a Bug
          </Button>
        </div>
      </form>

      {/* Here you would typically render the list of comments */}
      <div className="text-white">
        {/* Placeholder for comments list */}
        <p>Comments will be displayed here.</p>
      </div>
    </div>
  );
}