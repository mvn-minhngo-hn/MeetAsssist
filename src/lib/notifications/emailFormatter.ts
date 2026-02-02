import type { NotificationPayload } from '@/types';

export function formatEmail(payload: NotificationPayload): { subject: string; html: string } {
  const { meetingData, options } = payload;
  const { summary, actionItems, suggestions, duration, startTime, endTime, participantCount } = meetingData;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} phút ${remainingSeconds} giây`;
  };

  const subject = `Meeting Notes - ${meetingData.meetingContext} - ${formatDate(startTime)}`;

  const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Meeting Notes</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #3B82F6, #1D4ED8); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; }
    .header .subtitle { margin-top: 10px; font-size: 14px; opacity: 0.9; }
    .content { background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
    .section { margin-bottom: 25px; }
    .section h2 { color: #3B82F6; margin: 0 0 15px; font-size: 18px; border-bottom: 2px solid #E5E7EB; padding-bottom: 10px; }
    .summary { background: #F9FAFB; padding: 15px; border-left: 4px solid #3B82F6; border-radius: 4px; }
    .action-items { list-style: none; padding: 0; }
    .action-items li { padding: 10px; margin: 8px 0; background: #F0FDF4; border-left: 4px solid #10B981; border-radius: 4px; }
    .action-items li:before { content: '✓'; color: #10B981; font-weight: bold; margin-right: 8px; }
    .suggestions { background: #FEF3C7; padding: 15px; border-left: 4px solid #F59E0B; border-radius: 4px; }
    .suggestions h3 { margin: 0 0 10px; color: #F59E0B; font-size: 16px; }
    .suggestions ul { list-style: none; padding: 0; margin: 0; }
    .suggestions li { padding: 8px 0; position: relative; padding-left: 20px; }
    .suggestions li:before { content: '💡'; position: absolute; left: 0; }
    .metadata { background: #F3F4F6; padding: 15px; border-radius: 8px; font-size: 13px; color: #6B7280; }
    .metadata-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .footer { text-align: center; padding: 20px; color: #6B7280; font-size: 12px; border-top: 1px solid #E5E7EB; margin-top: 30px; }
    .footer strong { color: #3B82F6; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Meeting Notes</h1>
    <div class="subtitle">Tóm tắt cuộc họp thông minh với MeetAssist</div>
  </div>
  
  <div class="content">
    <div class="section">
      <h2>Tóm Tắt</h2>
      <div class="summary">${summary}</div>
    </div>

    ${actionItems.length > 0 ? `
    <div class="section">
      <h2>Các Việc Cần Làm</h2>
      <ul class="action-items">
        ${actionItems.map((item) => `<li>${item}</li>`).join('')}
      </ul>
    </div>
    ` : ''}

    ${suggestions.length > 0 ? `
    <div class="section">
      <div class="suggestions">
        <h3>💡 Gợi ý</h3>
        <ul>
          ${suggestions.map((suggestion) => `<li>${suggestion}</li>`).join('')}
        </ul>
      </div>
    </div>
    ` : ''}

    <div class="section">
      <h2>Thông Tin Cuộc Họp</h2>
      <div class="metadata">
        <div class="metadata-grid">
          <div><strong>Thời gian bắt đầu:</strong> ${formatDate(startTime)}</div>
          <div><strong>Thời gian kết thúc:</strong> ${formatDate(endTime)}</div>
          <div><strong>Thời lượng:</strong> ${formatDuration(duration)}</div>
          <div><strong>Số người tham gia:</strong> ${participantCount || 'N/A'}</div>
          <div><strong>Bối cảnh:</strong> ${meetingData.meetingContext}</div>
        </div>
      </div>
    </div>

    ${options.includeTranscript ? `
    <div class="section">
      <h2>Bản Ghi Chi Tiết</h2>
      <div style="background: #F9FAFB; padding: 15px; border-radius: 4px; max-height: 300px; overflow-y: auto; font-size: 13px;">
        ${meetingData.transcript.map(caption => `
          <div style="margin-bottom: 10px;">
            <strong style="color: #3B82F6;">${caption.speaker}:</strong>
            <span style="color: #6B7280; font-size: 12px;">[${new Date(caption.timestamp).toLocaleTimeString('vi-VN')}]</span>
            <p style="margin: 5px 0;">${caption.text}</p>
          </div>
        `).join('')}
      </div>
    </div>
    ` : ''}
  </div>

  <div class="footer">
    Powered by <strong>MeetAssist</strong> • AI-powered meeting assistant
  </div>
</body>
</html>
  `.trim();

  return { subject, html };
}

