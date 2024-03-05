class EventUtils:
    def __init__(self):
        pass
    
    def filter_events(self, events, user):
        filtered_events_by_school = []
        user_school = user['school'].upper()
        for event in events:
            visibility = list(event['selectedVisibility'].split(','))
            if user_school not in visibility:
                continue
            else:
                event['_id'] = str(event.get('_id'))
                event['eventImgId'] = str(event.get('eventImgId'))
                filtered_events_by_school.append(event)    
        return filtered_events_by_school
