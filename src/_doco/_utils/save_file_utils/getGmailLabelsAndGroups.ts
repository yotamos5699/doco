"use server";
import { getGmailClient } from "../../_google/clients";
// ["CATEGORY_PERSONAL", "CATEGORY_SOCIAL", "CATEGORY_PROMOTIONS", "CATEGORY_UPDATES", "CATEGORY_FORUMS"]
export async function getGmailLabelsAndGroups() {
  const gmail = await getGmailClient();

  try {
    const [labelsResponse] = await Promise.all([
      gmail.users.labels.list({
        userId: "me",
      }),
    ]);

    return (
      labelsResponse.data.labels?.map(
        ({
          id,
          name,
          messagesTotal,
          type,
          messagesUnread,
          color,
          labelListVisibility,
          messageListVisibility,
          threadsTotal,
          threadsUnread,
        }) => ({
          id,
          name,
          messagesTotal,
          type,
          messagesUnread,
          color,
          labelListVisibility,
          messageListVisibility,
          threadsTotal,
          threadsUnread,
        })
      ) || []
    );
    // groups: groupsResponse.data.messages || [],
  } catch (error) {
    throw error;
  }
}
