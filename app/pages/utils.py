from bson import ObjectId

def convert_objectid(data):
    """
    Recursively convert ObjectId to string in the dictionary.
    """
    if isinstance(data, dict):
        return {key: convert_objectid(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [convert_objectid(item) for item in data]
    elif isinstance(data, ObjectId):
        return str(data)
    else:
        return data