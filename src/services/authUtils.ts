import { api } from '@/lib/api-client';

const FALLBACK_GROUP_ID = '00000000-0000-0456-0001-000000000001';

export async function getGroupId(): Promise<string> {
	try {
		const { data } = await api.get('/auth/groups');
		const first = Array.isArray(data) && data.length > 0 ? data[0] : null;
		const id: string | undefined = first?.id ?? first?.group_id ?? first?.uuid;
		return id || FALLBACK_GROUP_ID;
	} catch {
		return FALLBACK_GROUP_ID;
	}
}


