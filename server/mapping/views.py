from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes, api_view
from rest_framework.response import Response
import requests
import os
from rest_framework import status


@api_view(["GET"])
@permission_classes((IsAuthenticated,))
def get_coords(request):
    try:
        data = request.GET.dict()
        query = data["address"]
        url = "https://geocode.search.hereapi.com/v1/geocode"
        payload = {"q": query, "apiKey": os.getenv("HERE_API")}
        r = requests.get(url, params=payload)
        response = r.json()
        try:
            position = response["items"][0]["position"]
        except:
            return Response(
                data={"message": "No location found"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        return Response(data=position, status=status.HTTP_200_OK)

    except KeyError:
        return Response(
            data={"message": "Send address"},
            status=status.HTTP_403_FORBIDDEN,
        )
    except Exception as e:
        print(e)
        return Response(
            data={"message": "An error occured"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
@permission_classes((IsAuthenticated,))
def get_route(request):
    try:
        data = request.data
        origin = data["origin"]
        destination = data["destination"]
        url = "https://router.hereapi.com/v8/routes"
        payload = {
            "origin": f'{origin["lat"]},{origin["lng"]}',
            "destination": f'{destination["lat"]},{destination["lng"]}',
            "transportMode": "car",
            "return": "polyline,summary,actions,instructions",
            "vehicle[speedCap]": "14",
            "apiKey": os.getenv("HERE_API"),
        }
        r = requests.get(url, params=payload)
        response = r.json()
        polyline = response["routes"][0]["sections"][0]["polyline"]
        summary = response["routes"][0]["sections"][0]["summary"]
        return Response(
            data={"polyline": polyline, "summary": summary}, status=status.HTTP_200_OK
        )
    except KeyError:
        return Response(
            data={"message": "Send the missing key"},
            status=status.HTTP_403_FORBIDDEN,
        )
    except Exception as e:
        print(e)
        return Response(
            data={"message": "An error occured"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
@permission_classes((IsAuthenticated,))
def get_route_via_charging(request):
    try:
        data = request.data
        origin = data["origin"]
        destination = data["destination"]
        initial_charge = data["initial_charge"]
        max_charge = data["max_charge"]
        if initial_charge <= 0.8 * max_charge:
            max_charge_after_charging = 0.8 * max_charge
        else:
            max_charge_after_charging = max_charge
        url = "https://router.hereapi.com/v8/routes"
        payload = {
            "origin": f'{origin["lat"]},{origin["lng"]}',
            "destination": f'{destination["lat"]},{destination["lng"]}',
            "transportMode": "car",
            "return": "polyline,summary,actions,instructions",
            "ev[freeFlowSpeedTable]": "0,0.239,27,0.239,45,0.259,60,0.196,75,0.207,90,0.238,100,0.26,110,0.296,120,0.337,130,0.351,250,0.351",
            "vehicle[speedCap]": "14",
            "ev[connectorTypes]": "iec62196Type2Combo",
            "ev[trafficSpeedTable]": "0,0.349,27,0.319,45,0.329,60,0.266,75,0.287,90,0.318,100,0.33,110,0.335,120,0.35,130,0.36,250,0.36",
            "ev[auxiliaryConsumption]": "1.8",
            "ev[ascent]": "9",
            "ev[descent]": "4.3",
            "ev[makeReachable]": "true",
            "ev[initialCharge]": initial_charge,
            "ev[maxCharge]": max_charge,
            "ev[chargingCurve]": "0,239,32,199,56,167,60,130,64,111,68,83,72,55,76,33,78,17,80,1",
            "ev[maxChargeAfterChargingStation]": max_charge_after_charging,
            "apiKey": os.getenv("HERE_API"),
        }
        r = requests.get(url, params=payload)
        response = r.json()
        polyline = response["routes"][0]["polyline"][0]
        summary = response["routes"][0]["summary"]

        return Response(
            data={"polyline": polyline, "summary": summary}, status=status.HTTP_200_OK
        )
    except KeyError:
        return Response(
            data={"message": "Send the missing key"},
            status=status.HTTP_403_FORBIDDEN,
        )
    except Exception as e:
        print(e)
        return Response(
            data={"message": "An error occured"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
