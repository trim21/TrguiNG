/**
 * transgui-ng - next gen remote GUI for transmission torrent daemon
 * Copyright (C) 2022  qu1ck (mail at qu1ck.org)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Button, Checkbox, Divider, Group, Modal, SegmentedControl, Text, TextInput } from "@mantine/core";
import React, { useCallback, useMemo, useState } from "react";
import { ActionModalState, LabelsData, LocationData, TorrentLabels, TorrentLocation, useTorrentLocation } from "./common";
import { PriorityColors, PriorityNumberType, PriorityStrings } from "rpc/transmission";

interface AddCommonProps {
    location: LocationData,
    labels: LabelsData,
    start: boolean,
    setStart: (b: boolean) => void,
    priority: PriorityNumberType,
    setPriority: (p: PriorityNumberType) => void,
}

function AddCommon(props: AddCommonProps) {
    return <>
        <TorrentLocation {...props.location} inputLabel="Torrent location" />
        <TorrentLabels {...props.labels} inputLabel="Torrent labels" />
        <Group>
            <Checkbox
                label="Start torrent"
                checked={props.start}
                onChange={(e) => props.setStart(e.currentTarget.checked)}
                my="xl"
                styles={{
                    root: {
                        flexGrow: 1
                    }
                }} />
            <SegmentedControl
                color={PriorityColors.get(props.priority)}
                value={String(props.priority)}
                onChange={(value) => props.setPriority(+value as PriorityNumberType)}
                data={Array.from(PriorityStrings.entries()).map(([k, v]) => ({
                    value: String(k),
                    label: v,
                }))} />
        </Group>
    </>;
}

interface AddCommonModalProps extends ActionModalState {
    allLabels: string[],
}

export function AddMagnet(props: AddCommonModalProps) {
    const [url, setUrl] = useState<string>("");
    const location = useTorrentLocation();
    const [labels, setLabels] = useState<string[]>([]);
    const [start, setStart] = useState<boolean>(true);
    const [priority, setPriority] = useState<PriorityNumberType>(0);

    const commonProps = useMemo<AddCommonProps>(() => ({
        location,
        labels: {
            labels,
            setLabels,
            allLabels: props.allLabels,
        },
        start,
        setStart,
        priority,
        setPriority,
    }), [location.path, labels, props.allLabels, start, priority]);

    const onAdd = useCallback(() => {
        props.actionController.addTorrent({
            url,
            downloadDir: location.path,
            labels,
            start,
            priority,
        });
        props.close();
    }, [props.actionController, url, location.path, labels, start, priority]);

    return (
        <Modal opened={props.opened} onClose={props.close} title="Add torrent by magnet link or URL" centered size="lg">
            <Divider my="sm" />
            <TextInput label="Link" w="100%" value={url} onChange={(e) => setUrl(e.currentTarget.value)} />
            <AddCommon {...commonProps} />
            <Divider my="sm" />
            <Group position="center" spacing="md">
                <Button onClick={onAdd} variant="filled">Add</Button>
                <Button onClick={props.close} variant="light">Cancel</Button>
            </Group>
        </Modal>
    );
}