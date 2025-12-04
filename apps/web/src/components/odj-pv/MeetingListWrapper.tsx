import { useState } from 'react';
import { MeetingList } from './MeetingList';
import { MeetingEditor } from './MeetingEditor';

export function MeetingListWrapper() {
  const [creatingNew, setCreatingNew] = useState(false);

  if (creatingNew) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-magenta/5 to-butter-yellow/5 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <MeetingEditor
            onSave={() => {
              setCreatingNew(false);
              // Refresh will happen via navigation
              window.location.reload();
            }}
            onCancel={() => setCreatingNew(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-magenta/5 to-butter-yellow/5 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <MeetingList onCreateNew={() => setCreatingNew(true)} />
      </div>
    </div>
  );
}
