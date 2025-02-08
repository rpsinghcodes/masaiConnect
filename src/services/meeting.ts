import axios from 'axios';
import ApiError from '../utils/ApiError.js';
import logger from '../config/logger.js';

const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID!;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET!;
const ZOOM_ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID!;
const ZOOM_TOKEN_URL = process.env.ZOOM_TOKEN_URL || 'https://zoom.us/oauth/token';
const ZOOM_API_BASE_URL = process.env.ZOOM_API_BASE_URL || 'https://api.zoom.us/v2';

interface MeetingDetails {
    title: string;
    type?: number;
    startTime: string;
    duration: number;
    description?: string;
    timeZone?: string;
    settings?: {
        host_video?: boolean;
        participant_video?: boolean;
        join_before_host?: boolean;
        mute_upon_entry?: boolean;
        waiting_room?: boolean;
        alternative_hosts?: string;
    };
}

interface ZoomMeetingResponse {
    zoomMeetingId: string;
    zoomJoinUrl: string;
    zoomStartUrl: string;
}

// Generate OAuth token to access Zoom API
async function getZoomAccessToken(): Promise<string> {
    try {
        logger.info('Fetching Zoom access token...');

        const response = await axios.post(
            ZOOM_TOKEN_URL,
            new URLSearchParams({
                grant_type: 'account_credentials',
                account_id: ZOOM_ACCOUNT_ID,
            }).toString(),
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        logger.info('Zoom access token fetched successfully:', response.data.access_token);
        return response.data.access_token;
    } catch (error: any) {
        logger.error('Error fetching Zoom access token:', error.response?.data || error.message);
        throw new ApiError(500, 'Failed to get Zoom access token');
    }
}

// Create a Zoom meeting
async function createZoomMeeting(meetingDetails: MeetingDetails): Promise<ZoomMeetingResponse> {
    try {
        const accessToken = await getZoomAccessToken();

        console.log('Creating Zoom meeting with details:', meetingDetails);

        const response = await axios.post(
            `${ZOOM_API_BASE_URL}/users/me/meetings`,
            {
                topic: meetingDetails.title,
                type: meetingDetails.type || 2,
                start_time: meetingDetails.startTime,
                agenda: meetingDetails.description || '',
                timezone: meetingDetails.timeZone || 'Asia/Kolkata',
                settings: meetingDetails.settings || {
                    host_video: true,
                    participant_video: true,
                    join_before_host: false,
                    mute_upon_entry: true,
                    waiting_room: true,
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        logger.info('Zoom meeting created successfully:', response.data);

        const { id, join_url, start_url } = response.data;

        return {
            zoomMeetingId: id,
            zoomJoinUrl: join_url,
            zoomStartUrl: start_url,
        };
    } catch (error: any) {
        logger.error('Error creating Zoom meeting:', error.response?.data || error.message);
        throw new ApiError(500, 'Failed to get Zoom access token');
    }
}

// Get a Zoom meeting by ID
async function getZoomMeeting(meetingId: string): Promise<any> {
    try {
        const accessToken = await getZoomAccessToken();

        const response = await axios.get(`${ZOOM_API_BASE_URL}/meetings/${meetingId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error: any) {
        logger.error('Error fetching Zoom meeting:', error.response?.data || error.message);
        throw new ApiError(500, 'Failed to get Zoom access token');
    }
}

// Update a Zoom meeting by ID
async function updateZoomMeeting(meetingId: string, meetingDetails: Partial<MeetingDetails>): Promise<boolean> {
    try {
        const accessToken = await getZoomAccessToken();

        await axios.patch(`${ZOOM_API_BASE_URL}/meetings/${meetingId}`, meetingDetails, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        return true;
    } catch (error: any) {
        console.error('Error updating Zoom meeting:', error.response?.data || error.message);
        throw new ApiError(500, 'Failed to get Zoom access token');
    }
}

// Delete a Zoom meeting by ID
async function deleteZoomMeeting(meetingId: string): Promise<boolean> {
    try {
        const accessToken = await getZoomAccessToken();

        await axios.delete(`${ZOOM_API_BASE_URL}/meetings/${meetingId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        return true;
    } catch (error: any) {
        console.error('Error deleting Zoom meeting:', error.response?.data || error.message);
        throw new ApiError(500, 'Failed to get Zoom access token');
    }
}
interface Participant {
    id: string;
    name: string;
    user_email: string;
    join_time: string;
    leave_time: string;
    duration: number;
    // You can add more fields here based on the Zoom API documentation if needed
}

interface ParticipantsReportResponse {
    page_count: number;
    page_size: number;
    total_records: number;
    next_page_token: string;
    participants: Participant[];
}

async function getMeetingDetails(meetingId: number): Promise<ParticipantsReportResponse> {
    try {
        const url = `https://api.zoom.us/v2/report/meetings/${meetingId}/participants`;
        const accessToken = await getZoomAccessToken();
        const response = await axios.get<ParticipantsReportResponse>(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log('response: ', response);
        return response.data;
    } catch (error) {
        console.log(error);
        throw new ApiError(500, 'Failed to get meeting details');
    }
}

export { createZoomMeeting, getZoomMeeting, updateZoomMeeting, deleteZoomMeeting, getMeetingDetails };
