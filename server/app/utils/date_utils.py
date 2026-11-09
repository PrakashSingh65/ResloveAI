from datetime import datetime, timezone


def ensure_utc(dt: datetime) -> datetime:
    """
    Ensure a datetime object is timezone-aware with UTC timezone.
    If the datetime is naive (no tzinfo), UTC is attached.
    If it already has tzinfo, it is converted to UTC.
    """
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)
